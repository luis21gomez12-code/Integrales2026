import React, { useState } from 'react';
import { Award, BookOpen, Lightbulb, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface SuccessCase {
  id: string;
  title: string;
  industry: string;
  companyConcept: string;
  challenge: string;
  solutionText: string;
  impact: string;
  formula: string;
  color: string;
  emoji: string;
}

const SUCCESS_CASES: SuccessCase[] = [
  {
    id: 'case-1',
    title: 'Optimización Térmica en Pasteurizadores Continuos',
    industry: 'Industria Láctea & Bebidas',
    companyConcept: 'Inspirado en los sistemas regenerativos Tetra Pak',
    challenge: 'Calcular con precisión la acumulación óptima de calor en los tubos del intercambiador para asegurar la pasteurización total de la leche sin llegar a quemar las proteínas solubles del suero lácteo (desnaturalización proteica por puntos calientes).',
    solutionText: 'Mediante la integración de los perfiles diferenciales de temperatura a lo largo de la tubería del intercambiador, los ingenieros calibraron el flujo másico exacto y la potencia del calentador. Se modeló la temperatura como una función de la distancia $x$.',
    impact: 'Reducción del 14.2% en el consumo energético de vapor de la caldera y retención de un 20% más de vitaminas termolábiles (B12 y C) en el producto final.',
    formula: 'T_{acumulada} = \\int_{0}^{L} \\left( T_{vapor} - (T_{vapor} - T_0) e^{-\\frac{U \\pi D}{\\dot{m} C_p} x} \\right) dx',
    color: 'from-blue-500 to-indigo-600',
    emoji: '🥛'
  },
  {
    id: 'case-2',
    title: 'Diseño de Tolvas e Inyectores de Extrusión',
    industry: 'Cereales de Desayuno & Snacks',
    companyConcept: 'Modelado para plantas extrusoras de cereales inflados',
    challenge: 'Las boquillas de los extrusores de maíz deben tener un perfil geométrico específico para que la masa gelatinizada fluya con velocidad de corte homogénea, evitando atascos que provoquen carbonización.',
    solutionText: 'Se diseñó la boquilla modelando su silueta lateral como un sólido de revolución e integrando mediante el método de cascarones cilíndricos y discos combinados para asegurar que el volumen interno real sea idéntico al perfil hidráulico simulado.',
    impact: 'Reducción del 99.4% en paradas técnicas por atascos de masa húmeda en la boquilla, aumentando el rendimiento de la línea en 4 toneladas diarias de cereal inflado.',
    formula: 'V_{boquilla} = \\pi \\int_{0.1}^{3.5} \\left( 1.5 e^{-0.4x} + 0.5 \\right)^2 dx',
    color: 'from-amber-500 to-orange-600',
    emoji: '🌾'
  },
  {
    id: 'case-3',
    title: 'Dosificación Germicida UV-C en Flujos Turbulentos',
    industry: 'Jugos & Esterilización No Térmica',
    companyConcept: 'Implementado para el tratamiento de jugos cítricos sensibles al calor',
    challenge: 'Calcular la dosis acumulada de energía electromagnética UV-C recibida por una pulpa de fruta opaca mientras se desplaza con flujo turbulento helicoidal para garantizar una letalidad de 5 logaritmos de Listeria innocua sin alterar el sabor.',
    solutionText: 'Se integró la densidad de flujo radiante recibido por elemento de volumen en función del tiempo de residencia e intensidad espacial de la lámpara. La potencia útil se evaluó con integrales trigonométricas avanzadas.',
    impact: 'Esterilización en frío exitosa, logrando mantener el jugo fresco por 30 días sin pérdida de sabor original ni destrucción de la Vitamina C por calor.',
    formula: '\\text{Dosis Acumulativa} = I_{max} \\int_{0}^{t_{contacto}} \\cos^2\\left(\\frac{\\pi v \\tau}{2R}\\right) d\\tau',
    color: 'from-purple-500 to-pink-600',
    emoji: '🍊'
  },
  {
    id: 'case-4',
    title: 'Monitoreo de Cinética de Secado en Spray Dryer',
    industry: 'Alimentos en Polvo (Café soluble, Sueros, Proteínas)',
    companyConcept: 'Optimización de cámaras de atomización vertical',
    challenge: 'Para evitar que las microgotas de extracto de café se adhieran a las paredes calientes de la cámara en estado húmedo (lo que causaría pérdidas e incendios), se debe predecir con exactitud el instante de secado crítico.',
    solutionText: 'Se integró por partes la ecuación diferencial de transferencia de masa de primer orden para calcular la trayectoria y pérdida de agua de las gotas atomizadas en la corriente de aire caliente suspendida.',
    impact: 'Aumento del 18.5% en la tasa de recuperación de polvo soluble de alta calidad y eliminación completa de paradas de limpieza de emergencia por adherencias sólidas.',
    formula: 'M_{evaporada} = \\int_{0}^{t_{caida}} 4\\pi r(\\tau)^2 \\cdot K_{difusion} \\cdot \\left( P_{saturacion} - P_{aire} \\right) d\\tau',
    color: 'from-teal-500 to-emerald-600',
    emoji: '☕'
  }
];

export default function AppliedCasesView() {
  const [selectedCase, setSelectedCase] = useState<SuccessCase | null>(SUCCESS_CASES[0]);

  return (
    <div className="animate-in slide-in-from-bottom-8 fade-in duration-300">
      
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8 border-b-4 border-emerald-700 relative overflow-hidden">
        <Sparkles size={130} className="absolute -right-6 -bottom-8 opacity-20 text-black pointer-events-none" />
        <span className="bg-emerald-400/30 text-emerald-100 font-extrabold uppercase text-[10px] tracking-widest px-2.5 py-1 rounded-full border border-emerald-300/20">
          Casos Aplicados de Éxito
        </span>
        <h2 className="text-3xl font-black mt-2 mb-1">Cálculo Integral en la Industria Real</h2>
        <p className="font-bold text-emerald-100 max-w-xl text-xs sm:text-sm leading-relaxed">
          Descubre cómo el cálculo integral no es solo teoría académica. Las mayores multinacionales alimentarias optimizan sus perfiles de temperatura, flujos, geometrías y secados utilizando integrales definidas exactas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation List Left */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block px-2">Selecciona un Caso de Éxito:</span>
          {SUCCESS_CASES.map((item) => {
            const isSelected = selectedCase?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedCase(item)}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex gap-3.5 ${
                  isSelected 
                    ? 'border-emerald-500 bg-white shadow-md scale-[1.01]' 
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-2xl shrink-0 bg-slate-100 h-10 w-10 rounded-xl flex items-center justify-center">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
                    {item.industry}
                  </span>
                  <h4 className={`text-xs font-black truncate mt-0.5 ${isSelected ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold truncate mt-1">
                    {item.companyConcept}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Details Container Right */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between">
              
              <div>
                {/* Header inside details */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">
                      {selectedCase.industry}
                    </span>
                    <h3 className="text-xl font-black text-slate-800 leading-tight mt-1">
                      {selectedCase.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold italic mt-0.5">
                      {selectedCase.companyConcept}
                    </p>
                  </div>
                  <span className="text-3xl">{selectedCase.emoji}</span>
                </div>

                {/* Problem Section */}
                <div className="mb-5 flex gap-3 items-start">
                  <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <div className="text-xs sm:text-sm">
                    <strong className="text-slate-800 font-extrabold block mb-1">El Desafío de Ingeniería:</strong>
                    <p className="text-slate-500 font-semibold leading-relaxed">
                      {selectedCase.challenge}
                    </p>
                  </div>
                </div>

                {/* Solution Section */}
                <div className="mb-5 flex gap-3 items-start">
                  <BookOpen className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  <div className="text-xs sm:text-sm">
                    <strong className="text-slate-800 font-extrabold block mb-1">La Solución con Cálculo Integral:</strong>
                    <p className="text-slate-500 font-semibold leading-relaxed">
                      {selectedCase.solutionText}
                    </p>
                  </div>
                </div>

                {/* Formula Display */}
                <div className="my-5 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 shadow-inner">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-2 text-center">
                    Integral de Modelado Real:
                  </span>
                  <div className="overflow-x-auto text-center font-bold text-slate-800">
                    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {`$$${selectedCase.formula}$$`}
                    </Markdown>
                  </div>
                </div>

                {/* Impact Section */}
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex gap-3 items-start mt-4">
                  <TrendingUp className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                  <div className="text-xs">
                    <strong className="text-emerald-800 font-black uppercase tracking-wider block mb-1">Impacto de la Optimización:</strong>
                    <p className="text-emerald-700 font-bold leading-relaxed">
                      {selectedCase.impact}
                    </p>
                  </div>
                </div>

              </div>

              <div className="text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-4 mt-6 flex items-center gap-1.5 justify-center">
                <Lightbulb size={12} className="text-amber-500 shrink-0" />
                <span>La ingeniería de alimentos avanza reduciendo costes gracias al rigor de la matemática aplicada.</span>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center h-full flex flex-col justify-center items-center">
              <Award size={48} className="text-slate-400 mb-2 animate-pulse" />
              <h4 className="font-extrabold text-slate-800 text-sm mb-1">Ningún caso seleccionado</h4>
              <p className="text-xs text-slate-400">Selecciona uno de la lista lateral para inspeccionar el impacto real.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
