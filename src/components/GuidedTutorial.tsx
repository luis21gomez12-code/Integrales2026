import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, X, Sparkles, Play, Award, HelpCircle, Map } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  targetId?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: React.ReactNode;
}

export default function GuidedTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const requestRef = useRef<number | null>(null);

  const STEPS: TutorialStep[] = [
    {
      title: '¡Bienvenido Ingeniero/a!',
      description: 'Te damos la bienvenida a IntegralFood. Aquí aprenderás cómo el Cálculo Integral resuelve problemas críticos en la ingeniería de alimentos real, desde el diseño de tuberías de pasteurización hasta el secado por aspersión.',
      position: 'center',
      icon: <Sparkles size={32} className="text-yellow-500" />
    },
    {
      title: 'La Ruta de Aprendizaje',
      description: 'Esta es tu hoja de ruta. Haz clic en el primer nodo numérico disponible para ver la teoría, interactuar con el laboratorio y desbloquear exámenes de dominio.',
      targetId: 'tour-path-node-1',
      position: 'bottom',
      icon: <Map size={24} className="text-emerald-500" />
    },
    {
      title: 'Casos de Éxito Aplicados',
      description: 'Haz clic aquí para explorar casos de éxito inspirados en multinacionales reales como Tetra Pak, optimizando pasteurizadores continuos, tolvas de extrusora y dosificadores UV-C.',
      targetId: 'tour-sidebar-casos',
      position: 'right',
      icon: <HelpCircle size={24} className="text-pink-500" />
    },
    {
      title: 'Laboratorio e Evaluaciones',
      description: 'Cada tema tiene un Simulador Interactivo donde puedes variar temperaturas, caudales o dimensiones para ver el cálculo paso a paso en tiempo real. ¡Supérate y obtén puntuación perfecta en el examen!',
      position: 'center',
      icon: <Award size={32} className="text-purple-500" />
    }
  ];

  useEffect(() => {
    // Check if user has completed tutorial
    const completed = localStorage.getItem('integralfood_tutorial_completed');
    if (!completed) {
      setIsOpen(true);
    }
  }, []);

  const updatePositions = () => {
    if (!isOpen) return;

    const step = STEPS[currentStep];
    if (!step.targetId) {
      // Centered step
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: '90%',
        maxWidth: '460px',
      });
      setHighlightStyle({ display: 'none' });
      return;
    }

    // Try desktop target first, fall back to mobile targets
    let target = document.getElementById(step.targetId);
    
    // If we're looking for the cases sidebar tab, it might be in mobile header or sidebar
    if (step.targetId === 'tour-sidebar-casos') {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        target = document.getElementById('tour-mobile-casos') || target;
      } else {
        target = document.getElementById('tour-desktop-casos') || target;
      }
    }

    if (step.targetId === 'tour-path-node-1') {
      target = document.getElementById('tour-path-node-1') || target;
    }

    if (!target) {
      // Fallback if target element not found
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: '90%',
        maxWidth: '460px',
      });
      setHighlightStyle({ display: 'none' });
      return;
    }

    const rect = target.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    // Set highlight overlay positioning around target
    const padding = 8;
    setHighlightStyle({
      position: 'absolute',
      top: `${rect.top + scrollY - padding}px`,
      left: `${rect.left + scrollX - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      zIndex: 9997,
      boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.75), 0 0 15px 4px rgba(59, 130, 246, 0.5)',
      borderRadius: '24px',
      pointerEvents: 'none',
      transition: 'all 0.3s ease'
    });

    // Position tooltip next to highlight
    const tooltipWidth = 320;
    const tooltipHeight = 180; // approximate
    let top = 0;
    let left = 0;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (step.position === 'right') {
      top = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + scrollX + 16;
      // Edge collision check
      if (left + tooltipWidth > windowWidth) {
        // Fallback to top
        top = rect.top + scrollY - tooltipHeight - 16;
        left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;
      }
    } else if (step.position === 'bottom') {
      top = rect.bottom + scrollY + 16;
      left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;
    } else if (step.position === 'top') {
      top = rect.top + scrollY - tooltipHeight - 16;
      left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;
    } else {
      // Default to center
      top = windowHeight / 2 + scrollY - tooltipHeight / 2;
      left = windowWidth / 2 + scrollX - tooltipWidth / 2;
    }

    // Keep within window bounds
    left = Math.max(16, Math.min(left, windowWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, windowHeight + scrollY - tooltipHeight - 50));

    setTooltipStyle({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      zIndex: 9998,
      transition: 'all 0.3s ease'
    });
  };

  useEffect(() => {
    if (isOpen) {
      updatePositions();
      window.addEventListener('resize', updatePositions);
      window.addEventListener('scroll', updatePositions);
    }
    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('integralfood_tutorial_completed', 'true');
    setIsOpen(false);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  // Expose manual launch button in UI via portal or return null if closed
  if (!isOpen) {
    return (
      <button 
        onClick={handleRestart}
        className="fixed bottom-4 right-4 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-wider py-2 px-3.5 rounded-full shadow-md z-40 transition-all flex items-center gap-1.5 border border-slate-700"
      >
        <Play size={10} className="fill-white" /> Tutorial Guiado
      </button>
    );
  }

  const stepInfo = STEPS[currentStep];

  return (
    <>
      {/* Background Dimmer for center steps */}
      {!stepInfo.targetId && (
        <div 
          className="fixed inset-0 bg-slate-950/75 z-[9990] transition-opacity duration-300" 
          onClick={handleComplete}
        />
      )}

      {/* Target Element Highlight */}
      {stepInfo.targetId && (
        <div style={highlightStyle} />
      )}

      {/* Tooltip dialog Card */}
      <div 
        style={tooltipStyle}
        className="bg-slate-900 text-white border-2 border-slate-700 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-xl shrink-0">
              {stepInfo.icon}
            </div>
            <div>
              <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest block">
                Paso {currentStep + 1} de {STEPS.length}
              </span>
              <h4 className="font-black text-sm text-slate-100">
                {stepInfo.title}
              </h4>
            </div>
          </div>
          <button 
            onClick={handleComplete}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            title="Omitir Tutorial"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 font-medium leading-relaxed mb-6">
          {stepInfo.description}
        </p>

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={handleComplete}
            className="text-[10px] text-slate-400 hover:text-slate-200 font-extrabold uppercase tracking-wider"
          >
            Omitir
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 font-black uppercase tracking-wider px-3 py-2 rounded-xl transition-colors"
              >
                <ArrowLeft size={12} /> Atrás
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-[10px] bg-blue-500 hover:bg-blue-400 text-white font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              {currentStep === STEPS.length - 1 ? '¡Comenzar!' : 'Siguiente'} <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
