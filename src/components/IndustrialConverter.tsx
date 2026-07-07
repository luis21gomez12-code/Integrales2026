import React, { useState, useEffect } from 'react';
import { Scale, Activity, Thermometer, Droplet, Gauge, RefreshCw, Lightbulb, Sparkles } from 'lucide-react';

interface ConversionOption {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  unitFrom: string;
  unitTo: string;
  formula: string;
  placeholderFrom: string;
  convert: (val: number) => { main: number; secondary?: { value: number; unit: string }[] };
  engineeringTip: string;
}

export default function IndustrialConverter() {
  const [selectedId, setSelectedId] = useState('brix-density');
  const [inputValue, setInputValue] = useState('12');
  const [result, setResult] = useState<any>(null);

  const OPTIONS: ConversionOption[] = [
    {
      id: 'brix-density',
      name: '°Brix a Densidad (Sólidos Solubles)',
      category: 'Concentración y Masa',
      icon: <Scale size={18} className="text-emerald-500" />,
      unitFrom: '°Brix',
      unitTo: 'g/cm³ (g/mL)',
      formula: '\\rho = 1 + \\frac{Brix}{258.6 - \\left(\\frac{Brix}{258.2} \\times 227.1\\right)}',
      placeholderFrom: '12',
      convert: (val) => {
        // Standard Brix to Density formula
        const d = 1 + val / (258.6 - (val / 258.2) * 227.1);
        const densityKgM3 = d * 1000;
        return {
          main: parseFloat(d.toFixed(4)),
          secondary: [
            { value: parseFloat(densityKgM3.toFixed(1)), unit: 'kg/m³' }
          ]
        };
      },
      engineeringTip: 'La densidad del jugo o jarabe es fundamental en el cálculo de integrales térmicas (Pasteurización). Permite convertir el caudal volumétrico en caudal másico (m_punto = rho * Q), clave para balances de calor continuos.'
    },
    {
      id: 'flow-rate',
      name: 'Caudal Volumétrico (Planta)',
      category: 'Dinámica de Fluidos',
      icon: <Activity size={18} className="text-blue-500" />,
      unitFrom: 'm³/h',
      unitTo: 'L/s',
      formula: 'L/s = \\frac{m^3/h}{3.6}',
      placeholderFrom: '15',
      convert: (val) => {
        const lps = val / 3.6;
        const gpm = val * 4.40287; // Gallons per minute
        return {
          main: parseFloat(lps.toFixed(4)),
          secondary: [
            { value: parseFloat(gpm.toFixed(2)), unit: 'GPM (Galones/min)' }
          ]
        };
      },
      engineeringTip: 'El tiempo de retención promedio en tuberías de esterilización UV-C se calcula integrando la velocidad del fluido. Un caudal de m³/h se simplifica a L/s para perfiles hidráulicos de laboratorio.'
    },
    {
      id: 'thermal-cond',
      name: 'Conductividad Térmica (Intercambiadores)',
      category: 'Transferencia de Calor',
      icon: <Thermometer size={18} className="text-red-500" />,
      unitFrom: 'W/(m·K)',
      unitTo: 'kcal/(h·m·°C)',
      formula: 'kcal/(h\\cdot m\\cdot °C) = W/(m\\cdot K) \\times 0.859845',
      placeholderFrom: '16', // Typical stainless steel
      convert: (val) => {
        const kcal = val * 0.859845;
        const btu = val * 0.577789; // BTU/(hr·ft·°F)
        return {
          main: parseFloat(kcal.toFixed(4)),
          secondary: [
            { value: parseFloat(btu.toFixed(4)), unit: 'BTU/(h·ft·°F)' }
          ]
        };
      },
      engineeringTip: 'En la pasteurización regenerativa, la resistencia de la pared metálica de acero inoxidable se evalúa en el gradiente diferencial de temperatura. W/(m·K) es la unidad SI estándar.'
    },
    {
      id: 'viscosity',
      name: 'Viscosidad Dinámica (Flujo Reológico)',
      category: 'Reología y Bombas',
      icon: <Droplet size={18} className="text-teal-500" />,
      unitFrom: 'cP (centipoise)',
      unitTo: 'Pa·s (Pascal-segundo)',
      formula: 'Pa\\cdot s = cP \\times 10^{-3}',
      placeholderFrom: '120', // Typical concentrate
      convert: (val) => {
        const pas = val * 0.001;
        const mPas = val; // 1 cP = 1 mPa·s
        return {
          main: parseFloat(pas.toFixed(5)),
          secondary: [
            { value: mPas, unit: 'mPa·s' }
          ]
        };
      },
      engineeringTip: 'Fluidos de alimentos como el chocolate, salsas o pulpa de fruta son altamente no Newtonianos. Su viscosidad disminuye o aumenta según la tasa de corte (esfuerzo cortante integrado en boquillas).'
    },
    {
      id: 'pressure',
      name: 'Presión de Autoclave e Hidráulica',
      category: 'Seguridad y Procesos',
      icon: <Gauge size={18} className="text-indigo-500" />,
      unitFrom: 'bar',
      unitTo: 'kPa',
      formula: 'kPa = bar \\times 100',
      placeholderFrom: '2.5',
      convert: (val) => {
        const kpa = val * 100;
        const psi = val * 14.5038;
        const atm = val * 0.986923;
        return {
          main: parseFloat(kpa.toFixed(2)),
          secondary: [
            { value: parseFloat(psi.toFixed(2)), unit: 'PSI (lb/in²)' },
            { value: parseFloat(atm.toFixed(3)), unit: 'atm (Atmósferas)' }
          ]
        };
      },
      engineeringTip: 'El cálculo del colapso estructural de silos o la esterilización por vapor saturado en autoclaves depende del control de presión manométrica en kPa para garantizar condiciones isotérmicas.'
    }
  ];

  const currentOption = OPTIONS.find(o => o.id === selectedId) || OPTIONS[0];

  useEffect(() => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      setResult(currentOption.convert(num));
    } else {
      setResult(null);
    }
  }, [inputValue, selectedId]);

  const handleQuickPreset = (val: number) => {
    setInputValue(val.toString());
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-emerald-500" />
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
          Convertidor de Unidades Industriales
        </h3>
      </div>
      <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-6">
        Herramienta de soporte para el Ingeniero de Procesos Alimentarios. Convierte parámetros operacionales reales para alimentar las integrales de balance de masa y transferencia de calor.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Navigation Column left */}
        <div className="md:col-span-5 flex flex-col gap-2">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider px-1">Selecciona una Variable de Proceso:</span>
          {OPTIONS.map((opt) => {
            const isSelected = opt.id === selectedId;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedId(opt.id);
                  setInputValue(opt.placeholderFrom);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold shadow-sm' 
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white shadow-sm' : 'bg-slate-200/50'}`}>
                  {opt.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-widest">{opt.category}</span>
                  <span className="text-xs font-extrabold truncate block">{opt.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Input & Calculator Column right */}
        <div className="md:col-span-7 bg-slate-50/80 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Cálculo de Conversión</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                Fórmula SI
              </span>
            </div>

            {/* Input card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-inner mb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">
                    Cantidad ({currentOption.unitFrom})
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full text-2xl font-black text-slate-800 outline-none placeholder-slate-300"
                    placeholder={currentOption.placeholderFrom}
                  />
                </div>
                <span className="text-sm font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                  {currentOption.unitFrom}
                </span>
              </div>

              {/* Quick presets */}
              <div className="flex gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0 self-center">Valores Típicos:</span>
                {selectedId === 'brix-density' && (
                  <>
                    <button onClick={() => handleQuickPreset(5)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">5° (Bajo)</button>
                    <button onClick={() => handleQuickPreset(12)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">12° (Jugo)</button>
                    <button onClick={() => handleQuickPreset(65)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">65° (Miel)</button>
                  </>
                )}
                {selectedId === 'flow-rate' && (
                  <>
                    <button onClick={() => handleQuickPreset(2)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">2 m³/h</button>
                    <button onClick={() => handleQuickPreset(10)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">10 m³/h</button>
                    <button onClick={() => handleQuickPreset(40)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">40 m³/h</button>
                  </>
                )}
                {selectedId === 'viscosity' && (
                  <>
                    <button onClick={() => handleQuickPreset(1)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">1 cP (Agua)</button>
                    <button onClick={() => handleQuickPreset(100)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">100 cP (Aceite)</button>
                    <button onClick={() => handleQuickPreset(1000)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">1K cP (Miel)</button>
                  </>
                )}
                {!['brix-density', 'flow-rate', 'viscosity'].includes(selectedId) && (
                  <>
                    <button onClick={() => handleQuickPreset(1)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">1.0</button>
                    <button onClick={() => handleQuickPreset(5)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">5.0</button>
                    <button onClick={() => handleQuickPreset(15)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700">15.0</button>
                  </>
                )}
              </div>
            </div>

            {/* Result display */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 mb-4">
              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider block mb-1">
                Resultado Equivalente
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-800">
                  {result ? result.main : '---'}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {currentOption.unitTo}
                </span>
              </div>

              {/* Secondary results */}
              {result && result.secondary && (
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-emerald-100/50 text-[11px]">
                  {result.secondary.map((sec: any, idx: number) => (
                    <span key={idx} className="font-semibold text-slate-500">
                      Equivale a: <strong className="text-slate-800">{sec.value}</strong> {sec.unit}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Engineering Insight Box */}
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex gap-2.5 items-start shadow-sm mt-2">
            <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-slate-800 block mb-0.5">Utilidad de Ingeniería:</strong>
              <p className="text-slate-500 font-medium">
                {currentOption.engineeringTip}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
