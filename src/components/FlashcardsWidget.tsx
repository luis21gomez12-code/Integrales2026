import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Trophy, 
  BookOpen, 
  Layers, 
  Star,
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Flashcard {
  id: string;
  title: string;
  subject: string;
  formula: string;
  description: string;
  meaning: string;
  stepByStep: string[];
  imageUrl: string;
  box: number; // 1 = Dificil (Repasar diario), 2 = Medio (Repasar c/2 dias), 3 = Facil (Dominado c/semana)
}

const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'card-1',
    title: 'Acumulación de Volumen en Tanques',
    subject: 'Balances de Materia',
    formula: 'V(t) = \\int_{t_1}^{t_2} Q(t) \\, dt + V_0',
    description: 'Calcula el volumen neto de pulpa o jarabe acumulado en un reactor cuando el caudal varía por fluctuaciones de la bomba.',
    meaning: '$Q(t)$ representa el caudal volumétrico de entrada como función del tiempo, y $V_0$ es el volumen inicial estático.',
    stepByStep: [
      'Determinar o aproximar la ecuación temporal del flujo de entrada $Q(t)$.',
      'Integrar término a término la función usando reglas estándar de potencias ($t^n \\to \\frac{t^{n+1}}{n+1}$).',
      'Establecer los límites temporales del llenado (tiempo de inicio $t_1$ y tiempo final $t_2$).',
      'Restar el valor de la antiderivada evaluada en el límite inferior al límite superior ($F(t_2) - F(t_1)$).',
      'Sumar el volumen inicial del tanque $V_0$ si ya contenía producto al inicio.'
    ],
    imageUrl: 'https://picsum.photos/seed/juicefactory/400/220',
    box: 1
  },
  {
    id: 'card-2',
    title: 'Destrucción Térmica de Patógenos',
    subject: 'Inocuidad Alimentaria',
    formula: '\\ln\\left(\\frac{N}{N_0}\\right) = -\\int_{0}^{t} k(T) \\, dt',
    description: 'Cuantifica la caída logística en la población de patógenos durante la pasteurización continua de la leche.',
    meaning: '$N_0$ es la carga bacteriana inicial, $N$ es la carga residual permitida, y $k(T)$ es el coeficiente de letalidad dependiente de la temperatura.',
    stepByStep: [
      'Registrar la curva de temperatura del autoclave en el tiempo $T(t)$.',
      'Calcular la constante cinética instantánea usando Arrhenius: $k(T) = k_0 e^{-E_a / (R T(t))}$.',
      'Integrar la función de letalidad $k(T)$ con respecto al tiempo transcurrido en el intercambiador de calor.',
      'Aplicar la función exponencial exponencial inversa para despejar la población remanente: $N = N_0 \\cdot e^{-\\int k(T) dt}$'
    ],
    imageUrl: 'https://picsum.photos/seed/milkprocessing/400/220',
    box: 1
  },
  {
    id: 'card-3',
    title: 'Volumen de Silos y Tolvas (Sólidos de Revolución)',
    subject: 'Diseño de Plantas',
    formula: 'V = \\pi \\int_{a}^{b} [f(x)]^2 \\, dx',
    description: 'Calcula el volumen exacto y capacidad de tolvas y silos verticales con formas curvas complejas (método de discos).',
    meaning: '$f(x)$ es la función matemática que describe la curvatura o perfil de la tolva al girar alrededor del eje X.',
    stepByStep: [
      'Definir la función matemática $y = f(x)$ que describe el perfil de revolución en la sección transversal lateral.',
      'Elevar la función de perfil al cuadrado para obtener la sección circular representativa: $[f(x)]^2$.',
      'Integrar el polinomio resultante en los límites de altura de la tolva, desde $x = a$ hasta $x = b$.',
      'Multiplicar la integral definitiva resuelta por la constante geométrica de pi ($\\pi$).'
    ],
    imageUrl: 'https://picsum.photos/seed/grainsilocoffee/400/220',
    box: 1
  },
  {
    id: 'card-4',
    title: 'Cinética de Pérdida de Humedad (Secado)',
    subject: 'Deshidratación',
    formula: 't = -\\frac{1}{k} \\int_{X_0}^{X_t} \\frac{dX}{X - X_e}',
    description: 'Determina el tiempo necesario de horno para deshidratar fruta (manzanas, mangos) hasta el porcentaje de agua idóneo.',
    meaning: '$X$ es la humedad en base seca, $X_e$ es la humedad de equilibrio higroscópico, y $k$ es la velocidad constante de secado del aire.',
    stepByStep: [
      'Establecer la humedad inicial de la rodaja de fruta $X_0$ y la humedad objetivo final de empaque $X_t$.',
      'Escribir la ecuación de velocidad de secado límite: $\\frac{dX}{dt} = -k(X - X_e)$.',
      'Separar variables llevando el diferencial $dX$ con el término $(X-X_e)$ e integrar dando un logaritmo natural.',
      'Despejar el tiempo $t$ de deshidratación: $t = \\frac{1}{k} \\ln\\left(\\frac{X_0 - X_e}{X_t - X_e}\\right)$.'
    ],
    imageUrl: 'https://picsum.photos/seed/driedapples/400/220',
    box: 1
  },
  {
    id: 'card-5',
    title: 'Dosis Germicida UV-C Acumulada',
    subject: 'Tecnologías Emergentes',
    formula: 'D = I_0 \\int_{0}^{t} \\sin^2(w \\tau) \\, d\\tau',
    description: 'Calcula la radiación electromagnética total recibida por un empaque flexible para inactivar mohos sin generar calor degradante.',
    meaning: '$I_0$ es la intensidad lumínica central de la lámpara, y $w$ es la frecuencia espacial de oscilación por rotación del empaque.',
    stepByStep: [
      'Identificar la potencia sinusoidal angular de la lámpara sobre la banda transportadora.',
      'Utilizar la identidad trigonométrica del ángulo medio para simplificar el cuadrado: $\\sin^2(A) = \\frac{1 - \\cos(2A)}{2}$.',
      'Resolver las integrales directas por separado: $\\int 1 \\, d\\tau = t$ y $\\int \\cos(2w\\tau) d\\tau = \\frac{\\sin(2w\\tau)}{2w}$.',
      'Evaluar en el intervalo de exposición de la lámpara para conocer la dosis acumulada en $\\text{mJ/cm}^2$.'
    ],
    imageUrl: 'https://picsum.photos/seed/uvlightsterilizer/400/220',
    box: 1
  },
  {
    id: 'card-6',
    title: 'Crecimiento de Levaduras (Fracciones Parciales)',
    subject: 'Biotecnología y Fermentación',
    formula: '\\int \\frac{1}{Y(K - Y)} \\, dY = \\frac{r}{K} \\cdot t',
    description: 'Modelo de crecimiento logístico limitado de levaduras para fermentación de cerveza o panificación en biorreactores.',
    meaning: '$Y$ es la población celular de levadura activa, $K$ es la capacidad de carga máxima del sustrato de malta, y $r$ es la tasa de reproducción.',
    stepByStep: [
      'Escribir la ecuación diferencial de crecimiento logístico acotado por nutrientes.',
      'Separar las variables de biomasa $Y$ del tiempo $t$ para conformar la integral racional.',
      'Descomponer la fracción racional del denominador en dos fracciones parciales independientes del tipo $\\frac{A}{Y} + \\frac{B}{K-Y}$.',
      'Resolver las constantes del numerador por el método de coeficientes indeterminados, integrando en logaritmos naturales.'
    ],
    imageUrl: 'https://picsum.photos/seed/beerfermentation/400/220',
    box: 1
  }
];

export default function FlashcardsWidget() {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('integralfood_flashcards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CARDS;
      }
    }
    return INITIAL_CARDS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeBoxFilter, setActiveBoxFilter] = useState<number | 'all'>('all');
  const [showConfetti, setShowConfetti] = useState(false);

  // Sync state to local storage
  const saveCards = (updatedCards: Flashcard[]) => {
    setCards(updatedCards);
    localStorage.setItem('integralfood_flashcards', JSON.stringify(updatedCards));
  };

  // Filtered list based on Spaced Repetition Box selector
  const filteredCards = cards.filter(card => 
    activeBoxFilter === 'all' ? true : card.box === activeBoxFilter
  );

  const currentCard = filteredCards[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
    setCurrentIndex(0);
  }, [activeBoxFilter]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const handleRateCard = (ratingBox: number) => {
    if (!currentCard) return;
    
    const updated = cards.map(c => {
      if (c.id === currentCard.id) {
        return { ...c, box: ratingBox };
      }
      return c;
    });

    saveCards(updated);
    
    // Play sound or show feedback
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);

    // Auto advance if there are more
    if (filteredCards.length > 1) {
      setTimeout(() => {
        handleNext();
      }, 500);
    }
  };

  const handleResetRepetition = () => {
    if (window.confirm('¿Deseas reiniciar el estado de repetición espaciada de todas las tarjetas?')) {
      const reset = cards.map(c => ({ ...c, box: 1 }));
      saveCards(reset);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  // Calculate box counts
  const countBox = (num: number) => cards.filter(c => c.box === num).length;
  const countAll = cards.length;

  return (
    <div className="w-full bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm mb-8 relative">
      
      {/* Tab Header inside the view */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-5">
        <div>
          <span className="bg-pink-100 text-pink-700 border border-pink-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit mb-1.5">
            <Layers size={10} /> Repetición Espaciada
          </span>
          <h3 className="text-xl font-black text-slate-800">Memorizador de Fórmulas Clave</h3>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">
            Entrena tu cerebro científico. El Ing. Gomez aconseja repasar las tarjetas de la **Caja 1** diariamente para consolidar el dominio.
          </p>
        </div>

        <button 
          onClick={handleResetRepetition}
          className="text-[10px] text-slate-400 hover:text-pink-600 font-bold uppercase tracking-wider transition-colors bg-slate-50 hover:bg-pink-50 p-2 rounded-xl"
        >
          Reiniciar Cajas 🔄
        </button>
      </div>

      {/* Spaced Repetition Level Selectors (Cajas 1, 2, 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        <button
          onClick={() => setActiveBoxFilter('all')}
          className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between gap-2 ${
            activeBoxFilter === 'all' 
              ? 'border-slate-800 bg-slate-800 text-white' 
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          }`}
        >
          <span>Todas</span>
          <span className="bg-slate-200/50 px-2 py-0.5 rounded-lg text-[10px] text-slate-700 font-black">{countAll}</span>
        </button>

        <button
          onClick={() => setActiveBoxFilter(1)}
          className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between gap-2 ${
            activeBoxFilter === 1 
              ? 'border-red-500 bg-red-500 text-white' 
              : 'border-red-100 bg-red-50/40 text-red-700 hover:border-red-200'
          }`}
        >
          <span className="flex items-center gap-1.5">🔴 Caja 1</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-black">{countBox(1)}</span>
        </button>

        <button
          onClick={() => setActiveBoxFilter(2)}
          className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between gap-2 ${
            activeBoxFilter === 2 
              ? 'border-amber-500 bg-amber-500 text-white' 
              : 'border-amber-100 bg-amber-50/40 text-amber-700 hover:border-amber-200'
          }`}
        >
          <span className="flex items-center gap-1.5">🟡 Caja 2</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-black">{countBox(2)}</span>
        </button>

        <button
          onClick={() => setActiveBoxFilter(3)}
          className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between gap-2 ${
            activeBoxFilter === 3 
              ? 'border-green-500 bg-green-500 text-white' 
              : 'border-green-100 bg-green-50/40 text-green-700 hover:border-green-200'
          }`}
        >
          <span className="flex items-center gap-1.5">🟢 Caja 3</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-black">{countBox(3)}</span>
        </button>
      </div>

      {filteredCards.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-10 text-center border-2 border-dashed border-slate-200 my-6">
          <Trophy size={48} className="text-green-500 mx-auto mb-3 animate-bounce" />
          <h4 className="font-extrabold text-slate-800 text-base mb-1">¡Felicidades! Caja sin pendientes</h4>
          <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
            No tienes tarjetas asignadas a este nivel de aprendizaje. ¡Selecciona "Todas" u otra caja para continuar entrenándote!
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          
          {/* Card Frame with Flip effect container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-xl cursor-pointer perspective-1000 mb-6 group relative"
          >
            {/* Visual highlight on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-300"></div>

            {/* Inner Flip Body */}
            <div className={`relative min-h-[360px] w-full rounded-3xl transition-all duration-500 transform style-preserve-3d bg-white border-2 border-slate-300 shadow-md ${
              isFlipped ? 'rotate-y-180' : ''
            }`}>
              
              {/* Card FRONT */}
              <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden rounded-3xl overflow-hidden bg-gradient-to-b from-white to-slate-50">
                
                {/* Image Illustration with absolute layout or top banner */}
                <div className="absolute inset-x-0 top-0 h-40 overflow-hidden relative border-b border-slate-200">
                  <img 
                    src={currentCard.imageUrl} 
                    alt={currentCard.title} 
                    className="w-full h-full object-cover grayscale-[20%] brightness-[92%] hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[9px] bg-white/25 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20 font-black uppercase tracking-widest">
                      {currentCard.subject}
                    </span>
                    <h4 className="text-lg font-black tracking-tight mt-1">{currentCard.title}</h4>
                  </div>
                </div>

                {/* Content middle */}
                <div className="flex-1 flex flex-col justify-center items-center py-4 my-2 text-center px-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Fórmula Científica</span>
                  <div className="bg-white/80 border border-slate-100 p-4 rounded-2xl w-full flex items-center justify-center shadow-inner overflow-x-auto">
                    <div className="text-xl sm:text-2xl font-black text-slate-800">
                      <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {`$$${currentCard.formula}$$`}
                      </Markdown>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold mt-3 leading-relaxed">
                    {currentCard.description}
                  </p>
                </div>

                {/* Flip Badge bottom */}
                <div className="text-center text-[10px] text-pink-600 font-extrabold uppercase tracking-wider border-t border-slate-100 pt-3 flex items-center justify-center gap-1">
                  <HelpCircle size={12} /> Clic para voltear y ver paso a paso
                </div>
              </div>

              {/* Card BACK */}
              <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden rotate-y-180 rounded-3xl bg-slate-900 text-white overflow-y-auto">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                    <span className="text-[10px] bg-pink-500 text-white font-black uppercase px-2 py-0.5 rounded-full tracking-widest">
                      {currentCard.subject} - Significado
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{currentIndex + 1} de {filteredCards.length}</span>
                  </div>

                  <h5 className="text-sm font-black text-pink-400 uppercase mb-1">Significado de Términos:</h5>
                  <div className="bg-slate-800 border border-slate-700/50 p-3 rounded-2xl text-xs text-slate-200 leading-relaxed font-semibold mb-4">
                    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {currentCard.meaning}
                    </Markdown>
                  </div>

                  <h5 className="text-sm font-black text-indigo-400 uppercase mb-2 flex items-center gap-1">
                    <TrendingUp size={14} /> Resolución Paso a Paso del Ing. Gomez:
                  </h5>
                  <div className="flex flex-col gap-1.5 text-xs text-slate-300 font-medium">
                    {currentCard.stepByStep.map((step, sIdx) => (
                      <div key={sIdx} className="flex gap-2 items-start bg-slate-800/40 p-2 rounded-xl border border-slate-800/60">
                        <span className="bg-indigo-600 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <div className="leading-relaxed">
                          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{step}</Markdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flip Badge bottom */}
                <div className="text-center text-[10px] text-slate-400 font-extrabold uppercase tracking-wider border-t border-slate-800 pt-3 mt-4">
                  Volver a ver la fórmula (Clic en cualquier parte)
                </div>
              </div>

            </div>
          </div>

          {/* Navigation and Spaced Repetition Box Sorter */}
          <div className="w-full max-w-xl bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-4">
            
            {/* Slide Navigation */}
            <div className="flex items-center justify-between">
              <button 
                onClick={handlePrev}
                className="p-2.5 hover:bg-slate-200 border-2 border-slate-300 rounded-xl transition-all"
                title="Tarjeta Anterior"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              
              <span className="text-xs text-slate-500 font-extrabold">
                Tarjeta {currentIndex + 1} de {filteredCards.length}
              </span>

              <button 
                onClick={handleNext}
                className="p-2.5 hover:bg-slate-200 border-2 border-slate-300 rounded-xl transition-all"
                title="Siguiente Tarjeta"
              >
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>

            {/* SRS Box Rating Buttons */}
            <div className="border-t border-slate-200 pt-3">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block text-center mb-2.5">
                ¿Qué tan fácil te resultó esta fórmula?
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleRateCard(1)}
                  className={`py-2.5 rounded-xl border-b-4 text-[10px] font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${
                    currentCard.box === 1 
                      ? 'bg-red-500 border-red-700 text-white' 
                      : 'bg-white border-slate-300 hover:bg-red-50 hover:text-red-700 border-b-2'
                  }`}
                >
                  <span className="text-sm">🔴</span>
                  <span>Difícil</span>
                </button>
                <button
                  onClick={() => handleRateCard(2)}
                  className={`py-2.5 rounded-xl border-b-4 text-[10px] font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${
                    currentCard.box === 2 
                      ? 'bg-amber-500 border-amber-700 text-white' 
                      : 'bg-white border-slate-300 hover:bg-amber-50 hover:text-amber-700 border-b-2'
                  }`}
                >
                  <span className="text-sm">🟡</span>
                  <span>Regular</span>
                </button>
                <button
                  onClick={() => handleRateCard(3)}
                  className={`py-2.5 rounded-xl border-b-4 text-[10px] font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${
                    currentCard.box === 3 
                      ? 'bg-green-500 border-green-700 text-white' 
                      : 'bg-white border-slate-300 hover:bg-green-50 hover:text-green-700 border-b-2'
                  }`}
                >
                  <span className="text-sm">🟢</span>
                  <span>Fácil</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Spaced Repetition CSS helper */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

    </div>
  );
}
