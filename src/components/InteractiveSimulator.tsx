import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Line, 
  ReferenceLine,
  ComposedChart
} from 'recharts';
import { Sliders, HelpCircle, Activity, Info, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface InteractiveSimulatorProps {
  topicId: string;
}

export default function InteractiveSimulator({ topicId }: InteractiveSimulatorProps) {
  // --- Topic 1 States ---
  const [t1Cbase, setT1Cbase] = useState(0.5);
  const [t1Alpha, setT1Alpha] = useState(0.06);
  const [t1A, setT1A] = useState(1);
  const [t1B, setT1B] = useState(3);

  // --- Topic 2 States ---
  const [t2Beta, setT2Beta] = useState(6);
  const [t2Gamma, setT2Gamma] = useState(4);
  const [t2X, setT2X] = useState(2);

  // --- Topic 3 States ---
  const [t3K, setT3K] = useState(1.0);
  const [t3B, setT3B] = useState(4);

  // --- Topic 4 States ---
  const [t4H, setT4H] = useState(2.0);
  const [t4B, setT4B] = useState(2.0);
  const [t4Shell, setT4Shell] = useState(1.2);

  // --- Topic 5 States ---
  const [t5E0, setT5E0] = useState(50);
  const [t5K, setT5K] = useState(0.1);
  const [t5Tend, setT5Tend] = useState(10);

  // --- Topic 6 States ---
  const [t6Amp, setT6Amp] = useState(10);
  const [t6B, setT6B] = useState(6);

  // --- Topic 7 States ---
  const [t7H, setT7H] = useState(2.0);
  const [t7B, setT7B] = useState(2.0);

  // --- Topic 8 States ---
  const [t8K, setT8K] = useState(0.5);
  const [t8Tfin, setT8Tfin] = useState(4);

  // --- Topic 9 States ---
  const [t9I0, setT9I0] = useState(20);
  const [t9W, setT9W] = useState(1.5);
  const [t9Theta, setT9Theta] = useState(1.05); // approx pi/3

  // --- Topic 10 States ---
  const [t10A, setT10A] = useState(2.0);
  const [t10B, setT10B] = useState(3.0);
  const [t10Xstart, setT10Xstart] = useState(0.0);
  const [t10Xend, setT10Xend] = useState(1.0);

  // --- MEMOIZED DATASETS & CALCULATIONS ---

  // Topic 1: Geometric Interpretation
  const t1Data = useMemo(() => {
    const points = [];
    for (let t = 0; t <= 5; t += 0.15) {
      const q = t1Cbase + t1Alpha * t * t;
      const roundedT = parseFloat(t.toFixed(2));
      const inRange = (roundedT >= t1A && roundedT <= t1B) ? q : null;
      points.push({
        t: roundedT,
        'Caudal Q(t)': parseFloat(q.toFixed(3)),
        'Área Integrada': inRange !== null ? parseFloat(inRange.toFixed(3)) : null
      });
    }
    return points;
  }, [t1Cbase, t1Alpha, t1A, t1B]);

  const t1IntegralVal = useMemo(() => {
    const F = (t: number) => t1Cbase * t + (t1Alpha * Math.pow(t, 3)) / 3;
    return parseFloat((F(t1B) - F(t1A)).toFixed(3));
  }, [t1Cbase, t1Alpha, t1A, t1B]);


  // Topic 2: Fundamental Theorem of Calculus
  const t2Data = useMemo(() => {
    const points = [];
    // Accumulator starting at a = 1
    const a = 1;
    const F_accum = (t: number) => (t2Beta / 3) * Math.pow(t, 3) - (t2Gamma / 2) * Math.pow(t, 2);
    const F_a = F_accum(a);

    for (let t = 0.5; t <= 5; t += 0.15) {
      const f = t2Beta * t * t - t2Gamma * t;
      const roundedT = parseFloat(t.toFixed(2));
      const inRange = (roundedT >= a && roundedT <= t2X) ? f : null;
      // F(t) - F(a)
      const accumulatedVal = roundedT >= a ? (F_accum(roundedT) - F_a) : 0;

      points.push({
        t: roundedT,
        'Tasa Calor f(t)': parseFloat(f.toFixed(2)),
        'Calor Integrado': inRange !== null ? parseFloat(inRange.toFixed(2)) : null,
        'Energía Acumulada G(t)': parseFloat(accumulatedVal.toFixed(2))
      });
    }
    return points;
  }, [t2Beta, t2Gamma, t2X]);

  const t2AccumulatedVal = useMemo(() => {
    const F_accum = (t: number) => (t2Beta / 3) * Math.pow(t, 3) - (t2Gamma / 2) * Math.pow(t, 2);
    return parseFloat((F_accum(t2X) - F_accum(1)).toFixed(2));
  }, [t2Beta, t2Gamma, t2X]);


  // Topic 3: Solids of Revolution (Disk Method)
  const t3Data = useMemo(() => {
    const points = [];
    for (let x = 0; x <= 10; x += 0.25) {
      const yVal = Math.sqrt(t3K * x);
      const roundedX = parseFloat(x.toFixed(2));
      const inRangeTop = roundedX <= t3B ? yVal : null;
      const inRangeBottom = roundedX <= t3B ? -yVal : null;

      points.push({
        x: roundedX,
        'Perfil Superior y(x)': parseFloat(yVal.toFixed(3)),
        'Perfil Inferior -y(x)': parseFloat((-yVal).toFixed(3)),
        'Sólido Superior': inRangeTop !== null ? parseFloat(inRangeTop.toFixed(3)) : null,
        'Sólido Inferior': inRangeBottom !== null ? parseFloat(inRangeBottom.toFixed(3)) : null
      });
    }
    return points;
  }, [t3K, t3B]);

  const t3VolumeVal = useMemo(() => {
    // V = pi * integral_0_b (k * x) dx = pi * k * b^2 / 2
    const vol = Math.PI * t3K * Math.pow(t3B, 2) / 2;
    return parseFloat(vol.toFixed(3));
  }, [t3K, t3B]);


  // Topic 4: Solids of Revolution (Cylindrical Shell Method)
  const t4Data = useMemo(() => {
    const points = [];
    for (let x = 0; x <= 5; x += 0.15) {
      const yVal = t4H * x;
      const roundedX = parseFloat(x.toFixed(2));
      const isShaded = roundedX <= t4B ? yVal : null;

      points.push({
        x: roundedX,
        'Altura f(x)': parseFloat(yVal.toFixed(2)),
        'Región Dosificada': isShaded !== null ? parseFloat(isShaded.toFixed(2)) : null
      });
    }
    return points;
  }, [t4H, t4B]);

  const t4VolumeVal = useMemo(() => {
    // V = 2pi * integral_0_b (h * x^2) dx = 2pi * h * b^3 / 3
    const vol = (2 * Math.PI * t4H * Math.pow(t4B, 3)) / 3;
    return parseFloat(vol.toFixed(2));
  }, [t4H, t4B]);

  const t4ActiveShellArea = useMemo(() => {
    // 2 * pi * x_shell * f(x_shell)
    const area = 2 * Math.PI * t4Shell * (t4H * t4Shell);
    return parseFloat(area.toFixed(2));
  }, [t4Shell, t4H]);


  // Topic 5: Exponentials & Logarithms
  const t5Data = useMemo(() => {
    const points = [];
    for (let t = 0; t <= 20; t += 0.5) {
      const E = t5E0 * Math.exp(-t5K * t);
      const roundedT = parseFloat(t.toFixed(2));
      const inRange = roundedT <= t5Tend ? E : null;

      points.push({
        t: roundedT,
        'Flujo Calor E(t)': parseFloat(E.toFixed(2)),
        'Calor Removido': inRange !== null ? parseFloat(inRange.toFixed(2)) : null
      });
    }
    return points;
  }, [t5E0, t5K, t5Tend]);

  const t5HeatTotal = useMemo(() => {
    // integral_0_t (E0 * e^-kt) dt = (E0/k) * (1 - e^-kt)
    const val = (t5E0 / t5K) * (1 - Math.exp(-t5K * t5Tend));
    return parseFloat(val.toFixed(2));
  }, [t5E0, t5K, t5Tend]);


  // Topic 6: Trigonometric Integrals
  const t6Data = useMemo(() => {
    const points = [];
    for (let t = 0; t <= 24; t += 0.5) {
      const rate = t6Amp * Math.cos((Math.PI * t) / 12);
      const roundedT = parseFloat(t.toFixed(2));
      const inRange = roundedT <= t6B ? rate : null;

      points.push({
        t: roundedT,
        'Tasa Oscilación T\'(t)': parseFloat(rate.toFixed(3)),
        'Cambio Térmico': inRange !== null ? parseFloat(inRange.toFixed(3)) : null
      });
    }
    return points;
  }, [t6Amp, t6B]);

  const t6TempChange = useMemo(() => {
    // integral_0_b (A * cos(pi*t/12)) dt = (12*A/pi) * sin(pi*b/12)
    const val = (12 * t6Amp / Math.PI) * Math.sin((Math.PI * t6B) / 12);
    return parseFloat(val.toFixed(2));
  }, [t6Amp, t6B]);


  // Topic 7: Hyperbolic Functions (Catenary Cable Length)
  const t7Data = useMemo(() => {
    const points = [];
    for (let x = -4; x <= 4; x += 0.2) {
      const yVal = t7H * Math.cosh(x / t7H);
      const roundedX = parseFloat(x.toFixed(2));
      const inRange = (roundedX >= 0 && roundedX <= t7B) ? yVal : null;

      points.push({
        x: roundedX,
        'Curva Catenaria y(x)': parseFloat(yVal.toFixed(3)),
        'Tramo Analizado': inRange !== null ? parseFloat(inRange.toFixed(3)) : null
      });
    }
    return points;
  }, [t7H, t7B]);

  const t7LengthVal = useMemo(() => {
    // L = integral_0_b sqrt(1 + sinh(x/H)^2) dx = integral_0_b cosh(x/H) dx = H * sinh(b/H)
    const len = t7H * Math.sinh(t7B / t7H);
    return parseFloat(len.toFixed(3));
  }, [t7H, t7B]);


  // Topic 8: Integration by Parts
  const t8Data = useMemo(() => {
    const points = [];
    for (let t = 0; t <= 10; t += 0.25) {
      const R = t * Math.exp(-t8K * t);
      const roundedT = parseFloat(t.toFixed(2));
      const inRange = roundedT <= t8Tfin ? R : null;

      points.push({
        t: roundedT,
        'Tasa Secado R(t)': parseFloat(R.toFixed(4)),
        'Humedad Removida': inRange !== null ? parseFloat(inRange.toFixed(4)) : null
      });
    }
    return points;
  }, [t8K, t8Tfin]);

  const t8MoistureTotal = useMemo(() => {
    // integral t*e^-kt dt = -t/k * e^-kt - 1/k^2 * e^-kt
    const F = (t: number) => - (t / t8K) * Math.exp(-t8K * t) - (1 / (t8K * t8K)) * Math.exp(-t8K * t);
    return parseFloat((F(t8Tfin) - F(0)).toFixed(3));
  }, [t8K, t8Tfin]);


  // Topic 9: Trigonometric Powers (UV Germicidal Dosis)
  const t9Data = useMemo(() => {
    const points = [];
    for (let theta = 0; theta <= 3.14; theta += 0.08) {
      const I = t9I0 * Math.pow(Math.sin(t9W * theta), 2);
      const roundedTheta = parseFloat(theta.toFixed(2));
      const inRange = roundedTheta <= t9Theta ? I : null;

      points.push({
        theta: roundedTheta,
        'Intensidad I(θ)': parseFloat(I.toFixed(2)),
        'Dosis UV-C': inRange !== null ? parseFloat(inRange.toFixed(2)) : null
      });
    }
    return points;
  }, [t9I0, t9W, t9Theta]);

  const t9DoseTotal = useMemo(() => {
    // integral_0_b I0 * sin^2(w*theta) dtheta = I0 * [ theta/2 - sin(2*w*theta) / (4*w) ]_0^b
    const b = t9Theta;
    const val = t9I0 * ( (b / 2) - Math.sin(2 * t9W * b) / (4 * t9W) );
    return parseFloat(val.toFixed(2));
  }, [t9I0, t9W, t9Theta]);


  // Topic 10: Partial Fractions (Inhibitory Acid Concentration)
  const t10Data = useMemo(() => {
    const points = [];
    // Ensure to prevent plotting near asymptotes (x = a and x = b)
    const upperLimit = Math.min(t10A, t10B) - 0.1;
    for (let x = 0; x <= upperLimit; x += 0.05) {
      const yVal = 1 / ((x - t10A) * (x - t10B));
      const roundedX = parseFloat(x.toFixed(2));
      const inRange = (roundedX >= t10Xstart && roundedX <= t10Xend) ? yVal : null;

      points.push({
        x: roundedX,
        'Tasa Inhibición f(x)': parseFloat(yVal.toFixed(3)),
        'Efecto Acumulado': inRange !== null ? parseFloat(inRange.toFixed(3)) : null
      });
    }
    return points;
  }, [t10A, t10B, t10Xstart, t10Xend]);

  const t10IntegralVal = useMemo(() => {
    // integral_start_end 1/((x-a)(x-b)) dx = [ 1/(a-b) * ln|(x-a)/(x-b)| ]
    const F = (x: number) => (1 / (t10A - t10B)) * Math.log(Math.abs((x - t10A) / (x - t10B)));
    return parseFloat((F(t10Xend) - F(t10Xstart)).toFixed(4));
  }, [t10A, t10B, t10Xstart, t10Xend]);


  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm mt-8 relative overflow-hidden">
      
      {/* Decorative Top Accent Banner */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
          <Activity size={20} className="animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800">Laboratorio Virtual de Simulación</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ajusta los parámetros y observa el balance en tiempo real</p>
        </div>
      </div>

      {/* --- RENDER SIMULATOR SPECIFIC TO ACTIVE TOPIC --- */}

      {/* Topic 1 Simulator */}
      {topicId === 'intro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Controles de Flujo
            </span>
            
            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Caudal Base (C_base):</span>
                <span className="text-indigo-600 font-black">{t1Cbase} L/s</span>
              </label>
              <input 
                type="range" min="0.1" max="1.5" step="0.1" 
                value={t1Cbase} onChange={(e) => setT1Cbase(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Coeficiente de Aceleración (α):</span>
                <span className="text-indigo-600 font-black">{t1Alpha}</span>
              </label>
              <input 
                type="range" min="0.01" max="0.15" step="0.01" 
                value={t1Alpha} onChange={(e) => setT1Alpha(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div className="border-t border-slate-200/60 pt-3">
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Tiempo de Inicio Válvula (a):</span>
                <span className="text-emerald-600 font-black">{t1A} s</span>
              </label>
              <input 
                type="range" min="0" max="4" step="1" 
                value={t1A} onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setT1A(val);
                  if (t1B <= val) setT1B(val + 1);
                }}
                className="w-full accent-emerald-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Tiempo de Cierre Válvula (b):</span>
                <span className="text-emerald-600 font-black">{t1B} s</span>
              </label>
              <input 
                type="range" min={t1A + 1} max="5" step="1" 
                value={t1B} onChange={(e) => setT1B(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t1Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="t" stroke="#94a3b8" tickFormatter={(v) => `${v}s`} />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v} L/s`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Tiempo: ${v} s`}
                  />
                  <Area type="monotone" dataKey="Área Integrada" stroke="none" fill="#22c55e" fillOpacity={0.4} />
                  <Line type="monotone" dataKey="Caudal Q(t)" stroke="#6366f1" strokeWidth={3} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-3xl text-sm font-semibold text-emerald-800 shadow-sm">
              <span className="font-black uppercase text-xs tracking-wider text-emerald-600 block mb-2">🧮 Fórmula Ampliada y Cálculo del Volumen</span>
              <div className="overflow-x-auto bg-white border border-emerald-100 p-5 rounded-2xl text-center shadow-inner my-3">
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$$V = \\int_{${t1A}}^{${t1B}} (${t1Cbase} + ${t1Alpha}t^2) dt = \\left[ ${t1Cbase}t + \\frac{${t1Alpha}t^3}{3} \\right]_{${t1A}}^{${t1B}} = \\mathbf{${t1IntegralVal}} \\text{ Litros}$$`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-emerald-100 pt-3 mt-3">
                <span className="font-black text-xs uppercase text-emerald-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-emerald-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Integrar la función:** Integramos término a término: $\\int ${t1Cbase} \\, dt = ${t1Cbase}t$ y $\\int ${t1Alpha}t^2 \\, dt = \\frac{${t1Alpha}}{3}t^3 = ${parseFloat((t1Alpha/3).toFixed(4))}t^3$.
2. **Evaluar límites:** Sustituimos los límites temporal superior $t = ${t1B}$ s y el inferior $t = ${t1A}$ s en la antiderivada.
3. **Sustracción final:** Restamos el valor inferior del superior: $[F(${t1B}) = ${parseFloat((t1Cbase * t1B + (t1Alpha * Math.pow(t1B, 3))/3).toFixed(3))}] - [F(${t1A}) = ${parseFloat((t1Cbase * t1A + (t1Alpha * Math.pow(t1A, 3))/3).toFixed(3))}] = \\mathbf{${t1IntegralVal}}$ litros netos dosificados.`}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic 2 Simulator */}
      {topicId === 'properties' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Balance Térmico
            </span>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Inercia Calor (β):</span>
                <span className="text-indigo-600 font-black">{t2Beta}</span>
              </label>
              <input 
                type="range" min="1" max="10" step="1" 
                value={t2Beta} onChange={(e) => setT2Beta(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Disipación (γ):</span>
                <span className="text-indigo-600 font-black">{t2Gamma}</span>
              </label>
              <input 
                type="range" min="1" max="10" step="1" 
                value={t2Gamma} onChange={(e) => setT2Gamma(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div className="border-t border-slate-200 pt-3">
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Límite de Acumulación (x):</span>
                <span className="text-blue-600 font-black">{t2X} horas</span>
              </label>
              <input 
                type="range" min="1.2" max="5.0" step="0.2" 
                value={t2X} onChange={(e) => setT2X(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={t2Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="t" stroke="#94a3b8" tickFormatter={(v) => `${v}h`} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Tiempo: ${v} h`}
                  />
                  <Area type="monotone" dataKey="Calor Integrado" stroke="none" fill="#3b82f6" fillOpacity={0.4} />
                  <Line type="monotone" dataKey="Tasa Calor f(t)" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Energía Acumulada G(t)" stroke="#10b981" strokeWidth={3} dot={false} />
                  <ReferenceLine x={t2X} stroke="#60a5fa" strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-3xl text-sm font-semibold text-blue-800 shadow-sm">
              <span className="font-black uppercase text-xs tracking-wider text-blue-600 block mb-2">🧮 Fórmula Ampliada (Teorema Fundamental del Cálculo)</span>
              <div className="overflow-x-auto bg-white border border-blue-100 p-5 rounded-2xl text-center shadow-inner my-3">
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$$G(x) = \\int_{1}^{${t2X}} (${t2Beta}t^2 - ${t2Gamma}t) dt = \\left[ \\frac{${t2Beta}t^3}{3} - \\frac{${t2Gamma}t^2}{2} \\right]_{1}^{${t2X}} = \\mathbf{${t2AccumulatedVal}} \\text{ Joules}$$`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-blue-100 pt-3 mt-3">
                <span className="font-black text-xs uppercase text-blue-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-blue-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Antiderivada:** La antiderivada de la tasa de calor $f(t) = ${t2Beta}t^2 - ${t2Gamma}t$ es $F(t) = \\frac{${t2Beta}}{3}t^3 - \\frac{${t2Gamma}}{2}t^2 = ${parseFloat((t2Beta/3).toFixed(2))}t^3 - ${parseFloat((t2Gamma/2).toFixed(2))}t^2$.
2. **Aplicar el Teorema:** Evaluamos en el extremo superior $t = ${t2X}$ y restamos el valor de referencia en el extremo inferior $t = 1$.
3. **Resultado neto de energía:** $[F(${t2X}) = ${parseFloat(((t2Beta * Math.pow(t2X, 3))/3 - (t2Gamma * Math.pow(t2X, 2))/2).toFixed(2))}] - [F(1) = ${parseFloat(((t2Beta * 1)/3 - (t2Gamma * 1)/2).toFixed(2))}] = \\mathbf{${t2AccumulatedVal}}$ Joules acumulados.`}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic 3 Simulator */}
      {topicId === 'solids_disk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Geometría del Extrusor
            </span>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Curvatura de Boquilla (k):</span>
                <span className="text-indigo-600 font-black">{t3K}</span>
              </label>
              <input 
                type="range" min="0.5" max="3.0" step="0.1" 
                value={t3K} onChange={(e) => setT3K(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Longitud Extrusión (b):</span>
                <span className="text-purple-600 font-black">{t3B} cm</span>
              </label>
              <input 
                type="range" min="1.0" max="10.0" step="0.5" 
                value={t3B} onChange={(e) => setT3B(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t3Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="x" stroke="#94a3b8" tickFormatter={(v) => `${v}cm`} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Eje X: ${v} cm`}
                  />
                  <Area type="monotone" dataKey="Sólido Superior" stroke="none" fill="#a855f7" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="Sólido Inferior" stroke="none" fill="#a855f7" fillOpacity={0.4} />
                  <Line type="monotone" dataKey="Perfil Superior y(x)" stroke="#d946ef" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Perfil Inferior -y(x)" stroke="#d946ef" strokeWidth={2} dot={false} />
                  <ReferenceLine x={t3B} stroke="#d946ef" strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-3xl text-sm font-semibold text-purple-800 shadow-sm">
              <span className="font-black uppercase text-xs tracking-wider text-purple-600 block mb-2">🧮 Fórmula de Discos Ampliada y Volumen de Revolución</span>
              <div className="overflow-x-auto bg-white border border-purple-100 p-5 rounded-2xl text-center shadow-inner my-3">
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$$V = \\pi \\int_{0}^{${t3B}} (\\sqrt{${t3K}x})^2 dx = \\pi \\int_{0}^{${t3B}} ${t3K}x \\, dx = \\pi \\left[ \\frac{${t3K}x^2}{2} \\right]_{0}^{${t3B}} = \\mathbf{${t3VolumeVal}} \\text{ cm}^3$$`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-purple-100 pt-3 mt-3">
                <span className="font-black text-xs uppercase text-purple-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-purple-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Elevar el radio al cuadrado:** El radio de giro de cada disco es $R(x) = \\sqrt{${t3K}x}$. Elevado al cuadrado queda $[R(x)]^2 = ${t3K}x$.
2. **Integrar la función:** Integramos $x$ obteniendo $\\int ${t3K}x \\, dx = \\frac{${t3K}}{2}x^2 = ${parseFloat((t3K/2).toFixed(2))}x^2$.
3. **Límites y factor de revolución:** Evaluamos desde $0$ hasta la longitud final $b = ${t3B}$ cm, y multiplicamos todo por \\pi para hallar el volumen tridimensional de la boquilla: **${t3VolumeVal}** $\\text{cm}^3$.`}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic 4 Simulator */}
      {topicId === 'solids_shell' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Geometría de Cascarón
            </span>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Pendiente h (Altura):</span>
                <span className="text-indigo-600 font-black">{t4H}</span>
              </label>
              <input 
                type="range" min="0.5" max="4.0" step="0.1" 
                value={t4H} onChange={(e) => setT4H(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Radio Externo del Tambor (b):</span>
                <span className="text-indigo-600 font-black">{t4B} dm</span>
              </label>
              <input 
                type="range" min="1.0" max="5.0" step="0.1" 
                value={t4B} onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setT4B(val);
                  if (t4Shell > val) setT4Shell(val - 0.2);
                }}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div className="border-t border-slate-200 pt-3">
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Examinar Radio Cascarón (x):</span>
                <span className="text-amber-600 font-black">{t4Shell} dm</span>
              </label>
              <input 
                type="range" min="0.1" max={t4B} step="0.1" 
                value={t4Shell} onChange={(e) => setT4Shell(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t4Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="x" stroke="#94a3b8" tickFormatter={(v) => `${v}dm`} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Radio: ${v} dm`}
                  />
                  <Area type="monotone" dataKey="Región Dosificada" stroke="none" fill="#6366f1" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="Altura f(x)" stroke="#4f46e5" strokeWidth={3} dot={false} />
                  <ReferenceLine x={t4Shell} stroke="#f59e0b" strokeWidth={2} label={{ value: 'Capa', fill: '#f59e0b', position: 'top' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-3xl text-sm font-semibold text-indigo-800 shadow-sm flex flex-col gap-3">
              <div>
                <span className="font-black uppercase text-xs tracking-wider text-indigo-600 block mb-2">🧮 Fórmula de Capas Cilíndricas Ampliada</span>
                <div className="overflow-x-auto bg-white border border-indigo-100 p-5 rounded-2xl text-center shadow-inner my-2">
                  <div className="text-xl sm:text-2xl font-black text-slate-800">
                    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {`$$V = 2\\pi \\int_{0}^{${t4B}} x ( ${t4H}x ) dx = 2\\pi \\left[ \\frac{${t4H}x^3}{3} \\right]_{0}^{${t4B}} = \\mathbf{${t4VolumeVal}} \\text{ Litros}$$`}
                    </Markdown>
                  </div>
                </div>
              </div>
              <div className="border-t border-indigo-200/60 pt-3">
                <span className="font-black text-xs uppercase text-indigo-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-indigo-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Multiplicar variables:** El integrando para los cilindros es $2\\pi \\cdot \\text{radio} \\cdot \\text{altura} = 2\\pi \\cdot x \\cdot (${t4H}x) = 2\\pi \\cdot ${t4H}x^2$.
2. **Integrar respecto a x:** Integramos $x^2$ usando la regla de potencia, obteniendo $\\int ${t4H}x^2 \\, dx = \\frac{${t4H}}{3}x^3 = ${parseFloat((t4H/3).toFixed(4))}x^3$.
3. **Sustituir radio del tambor:** Evaluamos en el límite superior $b = ${t4B}$ y multiplicamos por $2\\pi$, dando el volumen del chocolate: $2\\pi \\cdot \\frac{${t4H}}{3} \\cdot (${t4B})^3 = \\mathbf{${t4VolumeVal}}$ litros.`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-indigo-200/50 pt-2 text-[11px] text-indigo-700 font-bold">
                <strong>Capa Cilíndrica examinada:</strong> Radio = {t4Shell} dm | Altura = {parseFloat((t4H * t4Shell).toFixed(2))} dm | Área lateral = 2π · x · y ≈ <strong>{t4ActiveShellArea} dm²</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic 5 Simulator */}
      {topicId === 'exp_log' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Parámetros del Pasteurizador
            </span>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Flujo de Calor Inicial (E₀):</span>
                <span className="text-indigo-600 font-black">{t5E0} kW</span>
              </label>
              <input 
                type="range" min="10" max="100" step="5" 
                value={t5E0} onChange={(e) => setT5E0(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Constante de Enfriamiento (k):</span>
                <span className="text-indigo-600 font-black">{t5K}</span>
              </label>
              <input 
                type="range" min="0.05" max="0.30" step="0.01" 
                value={t5K} onChange={(e) => setT5K(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div className="border-t border-slate-200 pt-3">
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Tiempo de Retención (t_fin):</span>
                <span className="text-orange-600 font-black">{t5Tend} horas</span>
              </label>
              <input 
                type="range" min="1" max="20" step="1" 
                value={t5Tend} onChange={(e) => setT5Tend(parseInt(e.target.value))}
                className="w-full accent-orange-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t5Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="t" stroke="#94a3b8" tickFormatter={(v) => `${v}h`} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Tiempo: ${v} h`}
                  />
                  <Area type="monotone" dataKey="Calor Removido" stroke="none" fill="#f97316" fillOpacity={0.4} />
                  <Line type="monotone" dataKey="Flujo Calor E(t)" stroke="#ea580c" strokeWidth={3} dot={false} />
                  <ReferenceLine x={t5Tend} stroke="#ea580c" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-3xl text-sm font-semibold text-orange-800 shadow-sm">
              <span className="font-black uppercase text-xs tracking-wider text-orange-600 block mb-2">🧮 Fórmula Exponencial Ampliada (Calor Acumulado)</span>
              <div className="overflow-x-auto bg-white border border-orange-100 p-5 rounded-2xl text-center shadow-inner my-3">
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$$Q = \\int_{0}^{${t5Tend}} ${t5E0} e^{-${t5K}t} dt = \\left[ \\frac{${t5E0}}{-${t5K}} e^{-${t5K}t} \\right]_{0}^{${t5Tend}} = \\mathbf{${t5HeatTotal}} \\text{ kJ}$$`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-orange-100 pt-3 mt-3">
                <span className="font-black text-xs uppercase text-orange-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-orange-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Sustitución simple:** Para integrar $e^{-${t5K}t}$, usamos $u = -${t5K}t \\implies dt = \\frac{du}{-${t5K}}$, dando la antiderivada $\\int ${t5E0} e^{-${t5K}t} dt = -\\frac{${t5E0}}{${t5K}} e^{-${t5K}t} = -${parseFloat((t5E0/t5K).toFixed(2))} e^{-${t5K}t}$.
2. **Evaluar tiempo de retención:** Evaluamos en el tiempo transcurrido $t_{fin} = ${t5Tend}$ horas y en el tiempo inicial $t = 0$.
3. **Sustracción final:** $[-${parseFloat((t5E0/t5K).toFixed(2))} e^{-${parseFloat((t5K*t5Tend).toFixed(2))}}] - [-${parseFloat((t5E0/t5K).toFixed(2))}] = \\mathbf{${t5HeatTotal}}$ kJ totales de calor removido del alimento.`}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic 6 Simulator */}
      {topicId === 'trig' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Climatización de Silos
            </span>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Amplitud Térmica (A):</span>
                <span className="text-indigo-600 font-black">{t6Amp} °C/h</span>
              </label>
              <input 
                type="range" min="2" max="15" step="1" 
                value={t6Amp} onChange={(e) => setT6Amp(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Rango de Análisis (b):</span>
                <span className="text-pink-600 font-black">{t6B} horas</span>
              </label>
              <input 
                type="range" min="1" max="24" step="1" 
                value={t6B} onChange={(e) => setT6B(parseInt(e.target.value))}
                className="w-full accent-pink-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t6Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="t" stroke="#94a3b8" tickFormatter={(v) => `${v}h`} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Tiempo: ${v} h`}
                  />
                  <Area type="monotone" dataKey="Cambio Térmico" stroke="none" fill="#ec4899" fillOpacity={0.4} />
                  <Line type="monotone" dataKey="Tasa Oscilación T'(t)" stroke="#db2777" strokeWidth={3} dot={false} />
                  <ReferenceLine x={t6B} stroke="#db2777" strokeDasharray="5 5" />
                  <ReferenceLine y={0} stroke="#475569" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-pink-50 border-2 border-pink-200 p-6 rounded-3xl text-sm font-semibold text-pink-800 shadow-sm">
              <span className="font-black uppercase text-xs tracking-wider text-pink-600 block mb-2">🧮 Fórmula Trigonométrica Ampliada (Oscilación Térmica)</span>
              <div className="overflow-x-auto bg-white border border-pink-100 p-5 rounded-2xl text-center shadow-inner my-3">
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$$\\Delta T = \\int_{0}^{${t6B}} ${t6Amp} \\cos\\left(\\frac{\\pi t}{12}\\right) dt = \\left[ \\frac{12 \\cdot ${t6Amp}}{\\pi} \\sin\\left(\\frac{\\pi t}{12}\\right) \\right]_{0}^{${t6B}} = \\mathbf{${t6TempChange}} \\text{ °C}$$`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-pink-100 pt-3 mt-3">
                <span className="font-black text-xs uppercase text-pink-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-pink-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Integrar función coseno:** La antiderivada de $\\cos(cu)$ es $\\frac{1}{c}\\sin(cu)$. Con $c = \\frac{\\pi}{12}$, el coeficiente multiplicador se convierte en $\\frac{12}{\\pi} \\cdot ${t6Amp} = ${parseFloat((12 * t6Amp / Math.PI).toFixed(4))}$.
2. **Evaluar límites estacionales:** Evaluamos la función de amplitud en el límite de horas transcurridas $b = ${t6B}$ y restamos el valor en $t=0$ (que es $0$).
3. **Cambio de temperatura neto:** $${parseFloat((12 * t6Amp / Math.PI).toFixed(2))} \\cdot \\sin\\left(\\frac{\\pi \\cdot ${t6B}}{12}\\right) = \\mathbf{${t6TempChange}}$ °C acumulados en la chapa del silo.`}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic 7 Simulator */}
      {topicId === 'hyperbolic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Tensión Catenaria
            </span>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Tensión Horizontal (H):</span>
                <span className="text-indigo-600 font-black">{t7H} m</span>
              </label>
              <input 
                type="range" min="1.0" max="4.0" step="0.2" 
                value={t7H} onChange={(e) => setT7H(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Distancia Evaluada (b):</span>
                <span className="text-rose-600 font-black">{t7B} m</span>
              </label>
              <input 
                type="range" min="0.5" max="3.5" step="0.1" 
                value={t7B} onChange={(e) => setT7B(parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t7Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="x" stroke="#94a3b8" tickFormatter={(v) => `${v}m`} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Eje X: ${v} m`}
                  />
                  <Area type="monotone" dataKey="Tramo Analizado" stroke="none" fill="#f43f5e" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="Curva Catenaria y(x)" stroke="#f43f5e" strokeWidth={3} dot={false} />
                  <ReferenceLine x={t7B} stroke="#f43f5e" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-3xl text-sm font-semibold text-rose-800 shadow-sm">
              <span className="font-black uppercase text-xs tracking-wider text-rose-600 block mb-2">🧮 Fórmula Hiperbólica Ampliada (Longitud de Catenaria)</span>
              <div className="overflow-x-auto bg-white border border-rose-100 p-5 rounded-2xl text-center shadow-inner my-3">
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$$L = \\int_{0}^{${t7B}} \\cosh\\left(\\frac{x}{${t7H}}\\right) dx = \\left[ ${t7H} \\sinh\\left(\\frac{x}{${t7H}}\\right) \\right]_{0}^{${t7B}} = \\mathbf{${t7LengthVal}} \\text{ metros}$$`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-rose-100 pt-3 mt-3">
                <span className="font-black text-xs uppercase text-rose-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-rose-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Integración hiperbólica directa:** La integral directa del coseno hiperbólico es el seno hiperbólico: $\\int \\cosh\\left(\\frac{x}{${t7H}}\\right) dx = ${t7H} \\sinh\\left(\\frac{x}{${t7H}}\\right)$.
2. **Evaluar intervalo de vano:** Evaluamos en el límite horizontal $b = ${t7B}$ m y en la coordenada de inicio $x = 0$.
3. **Sustitución numérica:** El valor es $${t7H} \\cdot \\sinh\\left(\\frac{${t7B}}{${t7H}}\\right) = \\mathbf{${t7LengthVal}}$ metros lineales de riel de transporte suspendido.`}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic 8 Simulator */}
      {topicId === 'parts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Cinética de Secado
            </span>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Constante Secado (k):</span>
                <span className="text-indigo-600 font-black">{t8K} h⁻¹</span>
              </label>
              <input 
                type="range" min="0.1" max="1.5" step="0.1" 
                value={t8K} onChange={(e) => setT8K(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Tiempo de Horno (t_fin):</span>
                <span className="text-teal-600 font-black">{t8Tfin} horas</span>
              </label>
              <input 
                type="range" min="1.0" max="10.0" step="0.5" 
                value={t8Tfin} onChange={(e) => setT8Tfin(parseFloat(e.target.value))}
                className="w-full accent-teal-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t8Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="t" stroke="#94a3b8" tickFormatter={(v) => `${v}h`} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Tiempo: ${v} h`}
                  />
                  <Area type="monotone" dataKey="Humedad Removida" stroke="none" fill="#14b8a6" fillOpacity={0.4} />
                  <Line type="monotone" dataKey="Tasa Secado R(t)" stroke="#0d9488" strokeWidth={3} dot={false} />
                  <ReferenceLine x={t8Tfin} stroke="#0d9488" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-teal-50 border-2 border-teal-200 p-6 rounded-3xl text-sm font-semibold text-teal-800 shadow-sm">
              <span className="font-black uppercase text-xs tracking-wider text-teal-600 block mb-2">🧮 Fórmula de Integración por Partes Ampliada (Secado)</span>
              <div className="overflow-x-auto bg-white border border-teal-100 p-5 rounded-2xl text-center shadow-inner my-3">
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$$M = \\int_{0}^{${t8Tfin}} t e^{-${t8K}t} dt = \\left[ -\\frac{t}{${t8K}} e^{-${t8K}t} - \\frac{1}{${parseFloat((t8K*t8K).toFixed(3))}} e^{-${t8K}t} \\right]_{0}^{${t8Tfin}} = \\mathbf{${t8MoistureTotal}} \\text{ gramos}$$`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-teal-100 pt-3 mt-3">
                <span className="font-black text-xs uppercase text-teal-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-teal-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Establecer variables:** Aplicamos $\\int u \\, dv = uv - \\int v \\, du$ definiendo $u = t$ y $dv = e^{-${t8K}t} dt$. Por tanto $du = dt$ y $v = -\\frac{1}{${t8K}}e^{-${t8K}t}$.
2. **Formular términos:** Obtenemos $- \\frac{t}{${t8K}}e^{-${t8K}t} - \\int -\\frac{1}{${t8K}} e^{-${t8K}t} dt = - \\frac{t}{${t8K}}e^{-${t8K}t} - \\frac{1}{${parseFloat((t8K * t8K).toFixed(3))}}e^{-${t8K}t}$.
3. **Límites en el secadero:** Evaluamos en el tiempo final $t_{fin} = ${t8Tfin}$ h y restamos el límite inferior $t = 0$, resultando en la remoción neta de: **${t8MoistureTotal}** gramos de agua.`}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic 9 Simulator */}
      {topicId === 'trig_powers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Parámetros Germicidas
            </span>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Intensidad Máxima (I₀):</span>
                <span className="text-indigo-600 font-black">{t9I0} mW/cm²</span>
              </label>
              <input 
                type="range" min="5" max="50" step="1" 
                value={t9I0} onChange={(e) => setT9I0(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Frecuencia Espacial (w):</span>
                <span className="text-indigo-600 font-black">{t9W}</span>
              </label>
              <input 
                type="range" min="1.0" max="3.0" step="0.1" 
                value={t9W} onChange={(e) => setT9W(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div className="border-t border-slate-200 pt-3">
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Ángulo de Exposición (θ):</span>
                <span className="text-amber-600 font-black">{t9Theta} rad</span>
              </label>
              <input 
                type="range" min="0.2" max="3.1" step="0.1" 
                value={t9Theta} onChange={(e) => setT9Theta(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t9Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="theta" stroke="#94a3b8" tickFormatter={(v) => `${v}rad`} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Ángulo: ${v} rad`}
                  />
                  <Area type="monotone" dataKey="Dosis UV-C" stroke="none" fill="#f59e0b" fillOpacity={0.4} />
                  <Line type="monotone" dataKey="Intensidad I(θ)" stroke="#d97706" strokeWidth={3} dot={false} />
                  <ReferenceLine x={t9Theta} stroke="#d97706" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-sm font-semibold text-amber-800 shadow-sm">
              <span className="font-black uppercase text-xs tracking-wider text-amber-600 block mb-2">🧮 Fórmula de Potencias Trigonométricas Ampliada</span>
              <div className="overflow-x-auto bg-white border border-amber-100 p-5 rounded-2xl text-center shadow-inner my-3">
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$$\\text{Dosis} = \\int_{0}^{${t9Theta}} ${t9I0} \\sin^2(${t9W}\\theta) d\\theta = ${t9I0} \\left[ \\frac{\\theta}{2} - \\frac{\\sin(2 \\cdot ${t9W} \\theta)}{${4 * t9W}} \\right]_{0}^{${t9Theta}} = \\mathbf{${t9DoseTotal}} \\text{ mJ/cm}^2$$`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-amber-100 pt-3 mt-3">
                <span className="font-black text-xs uppercase text-amber-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-amber-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Reducción de potencias pares:** Sustituimos el cuadrado por la identidad de ángulo medio: $\\sin^2(${t9W}\\theta) = \\frac{1 - \\cos(2 \\cdot ${t9W}\\theta)}{2} = \\frac{1 - \\cos(${parseFloat((2*t9W).toFixed(2))}\\theta)}{2}$.
2. **Integración:** $\\int ${t9I0} \\left(\\frac{1 - \\cos(${parseFloat((2*t9W).toFixed(2))}\\theta)}{2}\\right) d\\theta = ${t9I0} \\left( \\frac{\\theta}{2} - \\frac{\\sin(${parseFloat((2*t9W).toFixed(2))}\\theta)}{${4*t9W}} \\right)$.
3. **Evaluar ángulo de incidencia:** Sustituimos en el límite superior $\\theta = ${t9Theta}$ rad y restamos el límite inferior para dar la dosis germicida de **${t9DoseTotal}** $\\text{mJ/cm}^2$.`}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic 10 Simulator */}
      {topicId === 'fractions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Inhibidores de Sustrato
            </span>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Inhibición (a):</span>
                <span className="text-indigo-600 font-black">{t10A}</span>
              </label>
              <input 
                type="range" min="1.5" max="2.5" step="0.1" 
                value={t10A} onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setT10A(val);
                  if (t10B <= val) setT10B(val + 1.0);
                }}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Inhibición (b):</span>
                <span className="text-indigo-600 font-black">{t10B}</span>
              </label>
              <input 
                type="range" min={t10A + 0.5} max="5.0" step="0.1" 
                value={t10B} onChange={(e) => setT10B(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div className="border-t border-slate-200 pt-3">
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Rango Integración Inicial (x_ini):</span>
                <span className="text-yellow-600 font-black">{t10Xstart}</span>
              </label>
              <input 
                type="range" min="0.0" max={t10A - 0.6} step="0.1" 
                value={t10Xstart} onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setT10Xstart(val);
                  if (t10Xend <= val) setT10Xend(val + 0.2);
                }}
                className="w-full accent-yellow-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-600 flex justify-between">
                <span>Rango Integración Final (x_fin):</span>
                <span className="text-yellow-600 font-black">{t10Xend}</span>
              </label>
              <input 
                type="range" min={t10Xstart + 0.1} max={t10A - 0.1} step="0.1" 
                value={t10Xend} onChange={(e) => setT10Xend(parseFloat(e.target.value))}
                className="w-full accent-yellow-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-64 bg-slate-900 rounded-2xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t10Data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="x" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    labelFormatter={(v) => `Sustrato x: ${v}`}
                  />
                  <Area type="monotone" dataKey="Efecto Acumulado" stroke="none" fill="#eab308" fillOpacity={0.4} />
                  <Line type="monotone" dataKey="Tasa Inhibición f(x)" stroke="#ca8a04" strokeWidth={3} dot={false} />
                  <ReferenceLine x={t10Xstart} stroke="#eab308" strokeDasharray="4 4" />
                  <ReferenceLine x={t10Xend} stroke="#eab308" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-3xl text-sm font-semibold text-yellow-800 shadow-sm">
              <span className="font-black uppercase text-xs tracking-wider text-yellow-600 block mb-2">🧮 Fórmula de Fracciones Parciales Ampliada en Vivo</span>
              <div className="overflow-x-auto bg-white border border-yellow-100 p-5 rounded-2xl text-center shadow-inner my-3">
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`$$I = \\int_{${t10Xstart}}^{${t10Xend}} \\frac{1}{(x-${t10A})(x-${t10B})} dx = \\left[ \\frac{1}{${parseFloat((t10A - t10B).toFixed(2))}} \\ln\\left| \\frac{x-${t10A}}{x-${t10B}} \\right| \\right]_{${t10Xstart}}^{${t10Xend}} = \\mathbf{${t10IntegralVal}}$$`}
                  </Markdown>
                </div>
              </div>
              <div className="border-t border-yellow-100 pt-3 mt-3">
                <span className="font-black text-xs uppercase text-yellow-700 block mb-2">📋 Explicación del Paso a Paso del Cálculo:</span>
                <div className="text-[11px] text-yellow-800 font-bold leading-relaxed space-y-2">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {`1. **Descomposición racional:** Planteamos $\\frac{1}{(x-${t10A})(x-${t10B})} = \\frac{A}{x-${t10A}} + \\frac{B}{x-${t10B}}$. Igualando numeradores obtenemos $A = \\frac{1}{${t10A} - ${t10B}} = ${parseFloat((1 / (t10A - t10B)).toFixed(4))}$ y $B = -A$.
2. **Resolver integrales logarítmicas:** Al integrar los términos lineales por separado resulta la antiderivada de oro: $\\frac{1}{${parseFloat((t10A - t10B).toFixed(2))}} \\ln\\left| \\frac{x-${t10A}}{x-${t10B}} \\right|$.
3. **Sustitución en el sustrato:** Evaluamos en los límites seleccionados $[${t10Xstart}, ${t10Xend}]$, dando un valor integrado neto del factor de inhibición de: **${t10IntegralVal}**.`}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- INFO BANNER FOOTER --- */}
      <div className="mt-5 border-t border-slate-100 pt-4 flex gap-2.5 items-start">
        <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          <strong>Acerca de esta Simulación:</strong> Las ecuaciones mostradas arriba se recalculan numéricamente en JavaScript a partir de las coordenadas instantáneas de los reguladores deslizantes. Mueve los controles para observar de forma interactiva el efecto del aumento de áreas y cómo cambian las constantes de los balances industriales alimentarios.
        </p>
      </div>

    </div>
  );
}
