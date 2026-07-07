import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Sliders, 
  HelpCircle, 
  Info, 
  Settings, 
  Layers, 
  TrendingUp, 
  ChevronRight, 
  BarChart2, 
  Eye, 
  Plus, 
  Minus,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '../lib/utils';

interface PresetFunction {
  id: string;
  name: string;
  description: string;
  unitX: string;
  unitY: string;
  labelX: string;
  labelY: string;
  formulaTex: string;
  antiderivativeTex: string;
  evalF: (x: number, c1: number, c2: number) => number;
  evalAntiderivative: (x: number, c1: number, c2: number) => number;
  defaultC1: number;
  defaultC2: number;
  minC1: number;
  maxC1: number;
  stepC1: number;
  labelC1: string;
  minC2: number;
  maxC2: number;
  stepC2: number;
  labelC2: string;
  stepExplanation: (a: number, b: number, c1: number, c2: number, exact: number) => string;
}

const PRESETS: PresetFunction[] = [
  {
    id: 'quadratic',
    name: 'Caudal de Bombeo (Cuadrática)',
    description: 'Modelado del caudal de alimentación de pulpa de fruta en función del tiempo de bombeo.',
    unitX: 's',
    unitY: 'L/s',
    labelX: 'Tiempo (t)',
    labelY: 'Caudal Q(t)',
    formulaTex: 'Q(t) = C_1 + C_2 t^2',
    antiderivativeTex: 'F(t) = C_1 t + \\frac{C_2}{3} t^3',
    defaultC1: 1.5,
    defaultC2: 0.1,
    minC1: 0.5,
    maxC1: 5.0,
    stepC1: 0.1,
    labelC1: 'Caudal Base (C₁)',
    minC2: 0.01,
    maxC2: 0.5,
    stepC2: 0.01,
    labelC2: 'Aceleración Bomba (C₂)',
    evalF: (x, c1, c2) => c1 + c2 * x * x,
    evalAntiderivative: (x, c1, c2) => c1 * x + (c2 / 3) * Math.pow(x, 3),
    stepExplanation: (a, b, c1, c2, exact) => {
      const f_a = c1 * a + (c2 / 3) * Math.pow(a, 3);
      const f_b = c1 * b + (c2 / 3) * Math.pow(b, 3);
      return `1. **Identificar la función:** La tasa de caudal es $Q(t) = ${c1} + ${c2} t^2$.
2. **Hallar la Antiderivada:** Integramos término a término:
   $$F(t) = \\int (${c1} + ${c2} t^2) dt = ${c1}t + \\frac{${c2}}{3} t^3 + C$$
3. **Aplicar límites de integración:** Evaluamos en el límite superior $t = ${b}$ s y en el límite inferior $t = ${a}$ s:
   - $F(${b}) = ${c1}(${b}) + \\frac{${c2}}{3} (${b})^3 = ${f_b.toFixed(4)}$ litros
   - $F(${a}) = ${c1}(${a}) + \\frac{${c2}}{3} (${a})^3 = ${f_a.toFixed(4)}$ litros
4. **Restar resultados:**
   $$V = F(${b}) - F(${a}) = ${f_b.toFixed(4)} - ${f_a.toFixed(4)} = \\mathbf{${exact.toFixed(4)}} \\text{ litros neta acumulados.}$$`;
    }
  },
  {
    id: 'trigonometric',
    name: 'Oscilación Térmica de Silo (Sinuoidal)',
    description: 'Fluctuación de la tasa de transferencia de calor en la chapa metálica de un silo durante el ciclo solar.',
    unitX: 'h',
    unitY: 'kW',
    labelX: 'Tiempo (t)',
    labelY: 'Tasa Calor (q)',
    formulaTex: 'q(t) = C_1 \\sin(0.5 t) + C_2',
    antiderivativeTex: 'F(t) = -2 C_1 \\cos(0.5 t) + C_2 t',
    defaultC1: 3.0,
    defaultC2: 4.0,
    minC1: 1.0,
    maxC1: 8.0,
    stepC1: 0.5,
    labelC1: 'Amplitud de Calor (C₁)',
    minC2: 2.0,
    maxC2: 8.0,
    stepC2: 0.5,
    labelC2: 'Calor Medio Ambiental (C₂)',
    evalF: (x, c1, c2) => c1 * Math.sin(0.5 * x) + c2,
    evalAntiderivative: (x, c1, c2) => -2 * c1 * Math.cos(0.5 * x) + c2 * x,
    stepExplanation: (a, b, c1, c2, exact) => {
      const f_a = -2 * c1 * Math.cos(0.5 * a) + c2 * a;
      const f_b = -2 * c1 * Math.cos(0.5 * b) + c2 * b;
      return `1. **Identificar la función:** La tasa de transferencia de calor es $q(t) = ${c1} \\sin(0.5t) + ${c2}$.
2. **Hallar la Antiderivada:** Integramos con respecto a la variable temporal:
   $$F(t) = \\int (${c1} \\sin(0.5t) + ${c2}) dt = -\\frac{${c1}}{0.5} \\cos(0.5t) + ${c2}t = -${2 * c1} \\cos(0.5t) + ${c2}t + C$$
3. **Aplicar límites de integración:** Evaluamos en $t = ${b}$ h y en $t = ${a}$ h:
   - $F(${b}) = -${2 * c1} \\cos(${0.5 * b}) + ${c2}(${b}) = ${f_b.toFixed(4)}$ kJ
   - $F(${a}) = -${2 * c1} \\cos(${0.5 * a}) + ${c2}(${a}) = ${f_a.toFixed(4)}$ kJ
4. **Diferencia de Energía:**
   $$Q_{neto} = F(${b}) - F(${a}) = ${f_b.toFixed(4)} - (${f_a.toFixed(4)}) = \\mathbf{${exact.toFixed(4)}} \\text{ kJ acumulados en la chapa.}$$`;
    }
  },
  {
    id: 'exponential',
    name: 'Cinética de Secado (Decaimiento)',
    description: 'Tasa instantánea de remoción de humedad en un deshidratador industrial de frutas en bandeja.',
    unitX: 'h',
    unitY: 'g/h',
    labelX: 'Tiempo (t)',
    labelY: 'Tasa Secado R(t)',
    formulaTex: 'R(t) = C_1 e^{-C_2 t}',
    antiderivativeTex: 'F(t) = -\\frac{C_1}{C_2} e^{-C_2 t}',
    defaultC1: 6.0,
    defaultC2: 0.3,
    minC1: 2.0,
    maxC1: 10.0,
    stepC1: 0.5,
    labelC1: 'Humedad Inicial (C₁)',
    minC2: 0.1,
    maxC2: 0.8,
    stepC2: 0.05,
    labelC2: 'Tasa de Secado (C₂)',
    evalF: (x, c1, c2) => c1 * Math.exp(-c2 * x),
    evalAntiderivative: (x, c1, c2) => -(c1 / c2) * Math.exp(-c2 * x),
    stepExplanation: (a, b, c1, c2, exact) => {
      const f_a = -(c1 / c2) * Math.exp(-c2 * a);
      const f_b = -(c1 / c2) * Math.exp(-c2 * b);
      return `1. **Identificar la función:** La velocidad de remoción de agua es $R(t) = ${c1} e^{-${c2}t}$.
2. **Hallar la Antiderivada:** Aplicando sustitución de variables simples:
   $$F(t) = \\int ${c1} e^{-${c2}t} dt = -\\frac{${c1}}{${c2}} e^{-${c2}t} = -${(c1 / c2).toFixed(4)} e^{-${c2}t} + C$$
3. **Evaluar en límites:** Sustituyendo el tiempo de deshidratado superior e inferior:
   - $F(${b}) = -${(c1 / c2).toFixed(3)} e^{-${(c2 * b).toFixed(3)}} = ${f_b.toFixed(4)}$ gramos
   - $F(${a}) = -${(c1 / c2).toFixed(3)} e^{-${(c2 * a).toFixed(3)}} = ${f_a.toFixed(4)}$ gramos
4. **Agua evaporada neta:**
   $$M_{total} = F(${b}) - F(${a}) = ${f_b.toFixed(4)} - (${f_a.toFixed(4)}) = \\mathbf{${exact.toFixed(4)}} \\text{ gramos de agua evaporada.}$$`;
    }
  },
  {
    id: 'linear',
    name: 'Crecimiento de Levadura (Lineal)',
    description: 'Crecimiento constante de la masa microbiana en un fermentador por adición regulada de glucosa.',
    unitX: 'h',
    unitY: 'g/h',
    labelX: 'Tiempo (t)',
    labelY: 'Tasa de Masa (dx/dt)',
    formulaTex: 'r(t) = C_1 + C_2 t',
    antiderivativeTex: 'F(t) = C_1 t + \\frac{C_2}{2} t^2',
    defaultC1: 1.0,
    defaultC2: 0.5,
    minC1: 0.5,
    maxC1: 4.0,
    stepC1: 0.1,
    labelC1: 'Tasa Inicial (C₁)',
    minC2: 0.1,
    maxC2: 2.0,
    stepC2: 0.1,
    labelC2: 'Factor Creciente (C₂)',
    evalF: (x, c1, c2) => c1 + c2 * x,
    evalAntiderivative: (x, c1, c2) => c1 * x + (c2 / 2) * x * x,
    stepExplanation: (a, b, c1, c2, exact) => {
      const f_a = c1 * a + (c2 / 2) * a * a;
      const f_b = c1 * b + (c2 / 2) * b * b;
      return `1. **Identificar la función:** La velocidad de acumulación de biomasa es $r(t) = ${c1} + ${c2} t$.
2. **Hallar la Antiderivada:** Integramos directamente:
   $$F(t) = \\int (${c1} + ${c2} t) dt = ${c1}t + \\frac{${c2}}{2} t^2 + C$$
3. **Límites de fermentación:** Evaluamos la masa generada en el período de horas $[${a}, ${b}]$:
   - $F(${b}) = ${c1}(${b}) + \\frac{${c2}}{2} (${b})^2 = ${f_b.toFixed(4)}$ gramos
   - $F(${a}) = ${c1}(${a}) + \\frac{${c2}}{2} (${a})^2 = ${f_a.toFixed(4)}$ gramos
4. **Masa de levadura neta:**
   $$\\Delta M = F(${b}) - F(${a}) = ${f_b.toFixed(4)} - ${f_a.toFixed(4)} = \\mathbf{${exact.toFixed(4)}} \\text{ gramos acumulados.}$$`;
    }
  }
];

export default function IntegralPlotter() {
  const [selectedFuncId, setSelectedFuncId] = useState<string>('quadratic');
  const [c1, setC1] = useState<number>(1.5);
  const [c2, setC2] = useState<number>(0.1);
  const [limitA, setLimitA] = useState<number>(1.0);
  const [limitB, setLimitB] = useState<number>(5.0);
  const [showRiemann, setShowRiemann] = useState<boolean>(true);
  const [riemannType, setRiemannType] = useState<'left' | 'right' | 'mid'>('mid');
  const [n, setN] = useState<number>(10);
  
  // Interactive graph hover tracking
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [draggingLimit, setDraggingLimit] = useState<'a' | 'b' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Retrieve current active function preset details
  const activePreset = useMemo(() => {
    const p = PRESETS.find(x => x.id === selectedFuncId) || PRESETS[0];
    return p;
  }, [selectedFuncId]);

  // Synchronize custom parameters when swapping presets
  useEffect(() => {
    setC1(activePreset.defaultC1);
    setC2(activePreset.defaultC2);
    // Standard secure defaults for integration range limits
    setLimitA(1.0);
    setLimitB(6.0);
  }, [selectedFuncId, activePreset]);

  // SVG grid sizing configuration constants
  const paddingX = 60;
  const paddingY = 40;
  const width = 600;
  const height = 300;

  // Maximum ranges for mathematical coordinates
  const minXVal = 0;
  const maxXVal = 8;
  const minYVal = 0;
  const maxYVal = 10;

  // Transform coordinates from math space to SVG canvas space
  const toSvgX = (x: number) => paddingX + (x / maxXVal) * (width - 2 * paddingX);
  const toSvgY = (y: number) => height - paddingY - (y / maxYVal) * (height - 2 * paddingY);

  // Transform from SVG canvas space back to math coordinates
  const toMathX = (svgX: number) => {
    const ratio = (svgX - paddingX) / (width - 2 * paddingX);
    return Math.max(minXVal, Math.min(maxXVal, ratio * maxXVal));
  };

  // Exact Analytical Integral calculation using second fundamental theorem
  const exactAreaValue = useMemo(() => {
    const valB = activePreset.evalAntiderivative(limitB, c1, c2);
    const valA = activePreset.evalAntiderivative(limitA, c1, c2);
    return valB - valA;
  }, [activePreset, limitA, limitB, c1, c2]);

  // Numerical approximation calculation (Riemann Sums)
  const riemannCalculation = useMemo(() => {
    const dx = (limitB - limitA) / n;
    let sum = 0;
    const rectangles: { x: number; y: number; width: number; height: number }[] = [];

    for (let i = 0; i < n; i++) {
      let sampleX = limitA + i * dx; // Default Left Riemann Sum
      if (riemannType === 'right') {
        sampleX = limitA + (i + 1) * dx;
      } else if (riemannType === 'mid') {
        sampleX = limitA + (i + 0.5) * dx;
      }

      const yVal = activePreset.evalF(sampleX, c1, c2);
      sum += yVal * dx;

      // Create geometry representations for visual rectangles on graph
      const rectX = limitA + i * dx;
      rectangles.push({
        x: rectX,
        y: yVal,
        width: dx,
        height: yVal
      });
    }

    return {
      sum,
      rectangles,
      dx
    };
  }, [activePreset, limitA, limitB, c1, c2, n, riemannType]);

  // Coordinate list generator to plot the continuous mathematical line
  const continuousLinePoints = useMemo(() => {
    const points: [number, number][] = [];
    const step = 0.05;
    for (let x = minXVal; x <= maxXVal; x += step) {
      const y = activePreset.evalF(x, c1, c2);
      points.push([toSvgX(x), toSvgY(y)]);
    }
    return points;
  }, [activePreset, c1, c2]);

  const linePathD = useMemo(() => {
    return continuousLinePoints.map(([x, y], idx) => `${idx === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  }, [continuousLinePoints]);

  // Shaded area path representation for exact integral
  const shadedAreaPathD = useMemo(() => {
    const points: string[] = [];
    // Start at bottom left (limitA, 0)
    points.push(`M ${toSvgX(limitA)} ${toSvgY(0)}`);
    
    // Line up to f(limitA)
    const step = 0.05;
    for (let x = limitA; x <= limitB; x += step) {
      points.push(`L ${toSvgX(x)} ${toSvgY(activePreset.evalF(x, c1, c2))}`);
    }
    // Add final endpoint
    points.push(`L ${toSvgX(limitB)} ${toSvgY(activePreset.evalF(limitB, c1, c2))}`);
    
    // Close path down to (limitB, 0) and back to start
    points.push(`L ${toSvgX(limitB)} ${toSvgY(0)}`);
    points.push('Z');
    
    return points.join(' ');
  }, [activePreset, limitA, limitB, c1, c2]);

  // Mouse move and drag event handlers for direct graph manipulation
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    
    // Scale client coordinate to SVG space coordinate
    const svgX = (clientX / rect.width) * width;
    const mathX = toMathX(svgX);

    if (draggingLimit === 'a') {
      // Prevent Limit A from crossing Limit B
      const rounded = Math.max(0, Math.min(limitB - 0.2, parseFloat(mathX.toFixed(1))));
      setLimitA(rounded);
    } else if (draggingLimit === 'b') {
      // Prevent Limit B from crossing Limit A
      const rounded = Math.min(maxXVal, Math.max(limitA + 0.2, parseFloat(mathX.toFixed(1))));
      setLimitB(rounded);
    } else {
      // Trace coordinate hover line
      if (svgX >= paddingX && svgX <= width - paddingX) {
        setHoverX(parseFloat(mathX.toFixed(2)));
      } else {
        setHoverX(null);
      }
    }
  };

  const handleSvgMouseUpOrLeave = () => {
    setDraggingLimit(null);
  };

  const startDragging = (limit: 'a' | 'b') => {
    setDraggingLimit(limit);
  };

  const hoverYVal = hoverX !== null ? activePreset.evalF(hoverX, c1, c2) : null;

  return (
    <div id="integral-plotter-root" className="bg-slate-50 border-2 border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-inner my-6 flex flex-col gap-6">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
            <span className="text-xl sm:text-2xl bg-green-500 text-white w-8 h-8 rounded-xl flex items-center justify-center font-black">∫</span>
            Trazador Interactivo de Integrales
          </h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Traza curvas físicas en tiempo real, manipula los límites del proceso y visualiza cómo la Suma de Riemann modela el área.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider hidden sm:block">Función:</span>
          <select 
            value={selectedFuncId}
            onChange={(e) => setSelectedFuncId(e.target.value)}
            className="w-full sm:w-64 bg-white border-2 border-slate-200 hover:border-green-400 font-bold text-xs p-2.5 rounded-xl text-slate-700 outline-none transition-all shadow-sm"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description Panel */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
          <TrendingUp size={24} />
        </div>
        <div>
          <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
            Contexto Físico
          </span>
          <p className="text-xs text-slate-600 font-semibold mt-1 leading-relaxed">
            {activePreset.description}
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Graph Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 relative select-none shadow-md overflow-hidden">
            
            {/* Axis titles inside chart */}
            <div className="absolute top-4 left-4 text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md">
              <span>{activePreset.labelY} ({activePreset.unitY})</span>
            </div>
            <div className="absolute bottom-1 right-4 text-slate-400 text-[10px] font-black uppercase tracking-wider bg-slate-800/80 px-2 py-1 rounded-md">
              <span>{activePreset.labelX} ({activePreset.unitX})</span>
            </div>

            {/* Main Interactive SVG Plotter */}
            <svg 
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-auto cursor-crosshair overflow-visible"
              onMouseMove={handleSvgMouseMove}
              onMouseLeave={handleSvgMouseUpOrLeave}
              onMouseUp={handleSvgMouseUpOrLeave}
            >
              {/* Background Grid Lines */}
              {Array.from({ length: 9 }).map((_, idx) => {
                const xVal = idx;
                const svgX = toSvgX(xVal);
                return (
                  <g key={`grid-x-${idx}`}>
                    <line 
                      x1={svgX} y1={paddingY} 
                      x2={svgX} y2={height - paddingY} 
                      stroke="#1e293b" strokeWidth={1} strokeDasharray={xVal === 0 ? "none" : "2 3"} 
                    />
                    <text 
                      x={svgX} y={height - paddingY + 16} 
                      fill="#64748b" fontSize={10} fontWeight="bold" textAnchor="middle"
                    >
                      {xVal}
                    </text>
                  </g>
                );
              })}

              {Array.from({ length: 11 }).map((_, idx) => {
                const yVal = idx;
                const svgY = toSvgY(yVal);
                return (
                  <g key={`grid-y-${idx}`}>
                    <line 
                      x1={paddingX} y1={svgY} 
                      x2={width - paddingX} y2={svgY} 
                      stroke="#1e293b" strokeWidth={1} strokeDasharray={yVal === 0 ? "none" : "2 3"} 
                    />
                    <text 
                      x={paddingX - 10} y={svgY + 4} 
                      fill="#64748b" fontSize={10} fontWeight="bold" textAnchor="end"
                    >
                      {yVal}
                    </text>
                  </g>
                );
              })}

              {/* Exact Integral - Shaded Area Under the Curve */}
              <path 
                d={shadedAreaPathD} 
                fill="#10b981" 
                fillOpacity={showRiemann ? 0.2 : 0.45} 
                className="transition-all duration-300"
              />

              {/* Riemann Rectangles approximation visualization */}
              {showRiemann && riemannCalculation.rectangles.map((rect, idx) => {
                const svgX = toSvgX(rect.x);
                const svgY = toSvgY(rect.height);
                const svgW = (rect.width / maxXVal) * (width - 2 * paddingX);
                const svgH = (rect.height / maxYVal) * (height - 2 * paddingY);
                return (
                  <rect
                    key={`riemann-rect-${idx}`}
                    x={svgX}
                    y={svgY}
                    width={svgW}
                    height={svgH}
                    fill="#3b82f6"
                    fillOpacity={0.4}
                    stroke="#2563eb"
                    strokeWidth={1.5}
                    className="hover:fill-blue-500 hover:fill-opacity-60 transition-colors"
                  />
                );
              })}

              {/* Continuous Mathematical Curve f(x) Line */}
              <path 
                d={linePathD} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth={3.5} 
                strokeLinecap="round"
              />

              {/* Interactive Draggable Limits a & b */}
              <g 
                className="cursor-ew-resize group" 
                onMouseDown={() => startDragging('a')}
              >
                {/* Visual shade overlay */}
                <line 
                  x1={toSvgX(limitA)} y1={paddingY} 
                  x2={toSvgX(limitA)} y2={height - paddingY} 
                  stroke="#ef4444" 
                  strokeWidth={draggingLimit === 'a' ? 3 : 2} 
                />
                <circle 
                  cx={toSvgX(limitA)} cy={paddingY + 10} 
                  r={draggingLimit === 'a' ? 8 : 6} 
                  fill="#ef4444" 
                  className="shadow-md transition-all group-hover:scale-125" 
                />
                <text 
                  x={toSvgX(limitA)} y={paddingY - 6} 
                  fill="#fca5a5" fontSize={10} fontWeight="black" textAnchor="middle"
                >
                  a = {limitA}
                </text>
              </g>

              <g 
                className="cursor-ew-resize group" 
                onMouseDown={() => startDragging('b')}
              >
                <line 
                  x1={toSvgX(limitB)} y1={paddingY} 
                  x2={toSvgX(limitB)} y2={height - paddingY} 
                  stroke="#3b82f6" 
                  strokeWidth={draggingLimit === 'b' ? 3 : 2} 
                />
                <circle 
                  cx={toSvgX(limitB)} cy={paddingY + 10} 
                  r={draggingLimit === 'b' ? 8 : 6} 
                  fill="#3b82f6" 
                  className="shadow-md transition-all group-hover:scale-125" 
                />
                <text 
                  x={toSvgX(limitB)} y={paddingY - 6} 
                  fill="#93c5fd" fontSize={10} fontWeight="black" textAnchor="middle"
                >
                  b = {limitB}
                </text>
              </g>

              {/* Coordinate Hover Line Marker */}
              {hoverX !== null && hoverYVal !== null && (
                <g pointerEvents="none">
                  <line 
                    x1={toSvgX(hoverX)} y1={paddingY} 
                    x2={toSvgX(hoverX)} y2={height - paddingY} 
                    stroke="#475569" strokeWidth={1} strokeDasharray="3 3" 
                  />
                  <circle 
                    cx={toSvgX(hoverX)} cy={toSvgY(hoverYVal)} 
                    r={5} fill="#f59e0b" stroke="#ffffff" strokeWidth={1.5} 
                  />
                  
                  {/* Tooltip render box */}
                  <g transform={`translate(${toSvgX(hoverX) + (hoverX > 4 ? -120 : 15)}, ${Math.min(height - 70, Math.max(paddingY, toSvgY(hoverYVal) - 30))})`}>
                    <rect 
                      width={105} height={42} rx={6} 
                      fill="#1e293b" opacity={0.9} stroke="#475569" strokeWidth={1} 
                    />
                    <text x={8} y={16} fill="#f8fafc" fontSize={9} fontWeight="bold">
                      x: {hoverX} {activePreset.unitX}
                    </text>
                    <text x={8} y={30} fill="#fbbf24" fontSize={9} fontWeight="bold">
                      y: {hoverYVal.toFixed(2)} {activePreset.unitY}
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Quick tips label */}
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest text-center">
            💡 Consejo: Haz click y arrastra los círculos rojos (a) o azules (b) para redefinir el intervalo directamente sobre el gráfico.
          </span>
        </div>

        {/* Right Column: Parameters, Inputs & Riemann Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Section: Function customization */}
          <div className="bg-white border-2 border-slate-200/60 rounded-2xl p-4 shadow-sm">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1 mb-3">
              <Settings size={14} className="text-green-600" /> Parámetros de la Curva
            </span>

            <div className="flex flex-col gap-3">
              {/* Coefficient C1 Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>{activePreset.labelC1}:</span>
                  <span className="text-green-600 font-black">{c1}</span>
                </div>
                <input 
                  type="range"
                  min={activePreset.minC1}
                  max={activePreset.maxC1}
                  step={activePreset.stepC1}
                  value={c1}
                  onChange={(e) => setC1(parseFloat(e.target.value))}
                  className="w-full accent-green-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer mt-1"
                />
              </div>

              {/* Coefficient C2 Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>{activePreset.labelC2}:</span>
                  <span className="text-green-600 font-black">{c2}</span>
                </div>
                <input 
                  type="range"
                  min={activePreset.minC2}
                  max={activePreset.maxC2}
                  step={activePreset.stepC2}
                  value={c2}
                  onChange={(e) => setC2(parseFloat(e.target.value))}
                  className="w-full accent-green-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer mt-1"
                />
              </div>
            </div>
          </div>

          {/* Section: Limits of Integration */}
          <div className="bg-white border-2 border-slate-200/60 rounded-2xl p-4 shadow-sm">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1 mb-3">
              <Sliders size={14} className="text-indigo-600" /> Límites del Intervalo [a, b]
            </span>

            <div className="flex flex-col gap-3">
              {/* Limit A */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"></span> Límite Inferior (a):</span>
                  <span className="text-red-500 font-black">{limitA} {activePreset.unitX}</span>
                </div>
                <input 
                  type="range"
                  min={0}
                  max={maxXVal - 0.5}
                  step={0.1}
                  value={limitA}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setLimitA(val);
                    if (limitB <= val) setLimitB(val + 0.5);
                  }}
                  className="w-full accent-red-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer mt-1"
                />
              </div>

              {/* Limit B */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block"></span> Límite Superior (b):</span>
                  <span className="text-blue-500 font-black">{limitB} {activePreset.unitX}</span>
                </div>
                <input 
                  type="range"
                  min={0.5}
                  max={maxXVal}
                  step={0.1}
                  value={limitB}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setLimitB(val);
                    if (limitA >= val) setLimitA(Math.max(0, val - 0.5));
                  }}
                  className="w-full accent-blue-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer mt-1"
                />
              </div>
            </div>
          </div>

          {/* Section: Riemann Sum Visualization Controls */}
          <div className="bg-white border-2 border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Layers size={14} className="text-blue-600" /> Sumas de Riemann
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showRiemann}
                  onChange={(e) => setShowRiemann(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {showRiemann && (
              <div className="flex flex-col gap-2.5 mt-1 animate-in slide-in-from-top-2 duration-150">
                {/* Approximation type */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-center">
                  {(['left', 'mid', 'right'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setRiemannType(t)}
                      className={cn(
                        "text-[10px] font-extrabold uppercase py-1 rounded-md transition-all",
                        riemannType === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {t === 'left' ? 'Izquierda' : t === 'right' ? 'Derecha' : 'Pto Medio'}
                    </button>
                  ))}
                </div>

                {/* Number of partitions */}
                <div>
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                    <span>Particiones (n):</span>
                    <span className="text-blue-600">{n} rectángulos</span>
                  </div>
                  <input 
                    type="range"
                    min={4}
                    max={40}
                    step={1}
                    value={n}
                    onChange={(e) => setN(parseInt(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer mt-1"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                    <span>Pocas (baja resol.)</span>
                    <span>Muchas (alta resol.)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Numerical Results Sandbox Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Exact Theoretical Integration Box */}
        <div className="md:col-span-6 bg-emerald-50 border-2 border-emerald-200/60 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block mb-1">
              🧪 Área Teórica Exacta (Cálculo Analítico)
            </span>
            <div className="font-mono text-2xl font-black text-emerald-800">
              ∫ = {exactAreaValue.toFixed(4)}
            </div>
            <p className="text-[10px] text-emerald-600/90 font-bold mt-1">
              Es el valor calculado mediante antiderivadas continuas con precisión decimal exacta.
            </p>
          </div>
          
          <div className="bg-white border border-emerald-100/80 rounded-xl px-3 py-1.5 mt-3 text-center text-xs font-black text-slate-700">
            {activePreset.unitY} acumulado: <span className="text-emerald-600">{exactAreaValue.toFixed(3)} {activePreset.unitX === 'h' ? 'horas' : 'segundos'} · L/s</span>
          </div>
        </div>

        {/* Riemann Sum Box */}
        <div className="md:col-span-6 bg-blue-50 border-2 border-blue-200/60 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 block mb-1">
              📊 Suma de Riemann Aproximada
            </span>
            <div className="font-mono text-2xl font-black text-blue-800">
              {showRiemann ? `Σ ≈ ${riemannCalculation.sum.toFixed(4)}` : 'Desactivado'}
            </div>
            <p className="text-[10px] text-blue-600/90 font-bold mt-1">
              {showRiemann 
                ? `Ancho de cada rectángulo (dx) = ${riemannCalculation.dx.toFixed(3)}.`
                : 'Activa el control para ver la suma aproximada y su error.'
              }
            </p>
          </div>

          {showRiemann && (
            <div className="bg-white border border-blue-100/80 rounded-xl px-3 py-1.5 mt-3 text-xs font-bold text-slate-700 flex justify-between">
              <span>Error del método:</span>
              <span className="font-mono font-black text-amber-600">
                {Math.abs(exactAreaValue - riemannCalculation.sum).toFixed(5)} ({Math.abs(((exactAreaValue - riemannCalculation.sum) / exactAreaValue) * 100).toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KaTeX Step-by-Step Interactive Solver Explanation */}
      <div className="bg-white border-2 border-slate-200/60 p-5 rounded-2xl shadow-sm flex flex-col gap-3">
        <span className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1">
          <CheckCircle2 size={14} className="text-green-500" /> Solución Analítica Paso a Paso del Intervalo
        </span>

        {/* Big LaTeX equation displaying standard integral limits */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 overflow-x-auto text-center font-bold">
          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {`$$\\text{Área} = \\int_{${limitA}}^{${limitB}} \\left( ${activePreset.formulaTex} \\right) dt = \\left[ ${activePreset.antiderivativeTex} \\right]_{${limitA}}^{${limitB}} = \\mathbf{${exactAreaValue.toFixed(4)}} \\quad \\text{Unidades}$$`}
          </Markdown>
        </div>

        {/* Step detailed text */}
        <div className="prose prose-slate max-w-none text-xs font-medium text-slate-600 leading-relaxed space-y-3 mt-1 border-t border-slate-100 pt-3">
          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {activePreset.stepExplanation(limitA, limitB, c1, c2, exactAreaValue)}
          </Markdown>
        </div>
      </div>

    </div>
  );
}
