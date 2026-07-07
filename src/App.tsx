import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  BookOpen, 
  Map, 
  X, 
  BrainCircuit, 
  Upload, 
  MessageSquare, 
  Flame, 
  Zap, 
  Award, 
  RotateCcw, 
  Edit2, 
  Check, 
  CheckCircle2, 
  Trophy, 
  AlertTriangle,
  ClipboardCheck,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  Play
} from 'lucide-react';
import { topics, quizzes, formulasOfTheDay } from './data';
import { Topic, Quiz } from './types';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { cn } from './lib/utils';
import InteractiveSimulator from './components/InteractiveSimulator';
import FlashcardsWidget from './components/FlashcardsWidget';
import AppliedCasesView from './components/AppliedCasesView';
import IndustrialConverter from './components/IndustrialConverter';
import GuidedTutorial from './components/GuidedTutorial';
import IntegralPlotter from './components/IntegralPlotter';

type ViewState = 'path' | 'lesson' | 'quiz' | 'ai' | 'evaluations' | 'casos_aplicados' | 'flashcards';

const AVATARS = ['🥗', '🧪', '🥛', '🍎', '🍞', '🥩', '🏭', '📐', '🧠', '🔬', '👩‍🔬', '👨‍🔬', '🍩', '🥑', '🍕', '🍰', '☕'];

interface UserProgress {
  completedTopics: string[];
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  userName: string;
  userAvatar?: string;
}

const DEFAULT_PROGRESS: UserProgress = {
  completedTopics: [],
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  userName: 'Estudiante de Alimentos',
  userAvatar: '🥗'
};

export default function App() {
  const [view, setViewState] = useState<ViewState>('path');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [formulaIndex, setFormulaIndex] = useState(0);
  
  // Persistent user progress state
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('integralfood_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          completedTopics: parsed.completedTopics || [],
          xp: parsed.xp || 0,
          streak: parsed.streak || 0,
          lastStudyDate: parsed.lastStudyDate || null,
          userName: parsed.userName || 'Estudiante de Alimentos',
          userAvatar: parsed.userAvatar || '🥗'
        };
      } catch (e) {
        return DEFAULT_PROGRESS;
      }
    }
    return DEFAULT_PROGRESS;
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.userName);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);


  // Set Formula of the Day based on the day of month or default index
  useEffect(() => {
    const day = new Date().getDate();
    setFormulaIndex(day % formulasOfTheDay.length);
  }, []);

  // Check and update study streak on mount or activity
  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastStudyDate === today) return;

    let newStreak = progress.streak;
    if (progress.lastStudyDate) {
      const lastDate = new Date(progress.lastStudyDate);
      const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // Reset if they missed a day
      }
    } else {
      newStreak = 1; // First study session
    }

    saveProgress({
      ...progress,
      streak: newStreak,
      lastStudyDate: today
    });
  }, []);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      saveProgress({
        ...progress,
        userName: nameInput.trim()
      });
    }
    setIsEditingName(false);
  };

  const handleSelectAvatar = (av: string) => {
    saveProgress({
      ...progress,
      userAvatar: av
    });
    setIsEditingAvatar(false);
  };

  const handleResetProgress = () => {
    if (window.confirm('¿Estás seguro de que quieres restablecer todo tu progreso? Esto borrará tus puntos de experiencia y temas completados.')) {
      saveProgress({
        completedTopics: [],
        xp: 0,
        streak: 1,
        lastStudyDate: new Date().toDateString(),
        userName: 'Estudiante de Alimentos'
      });
      setNameInput('Estudiante de Alimentos');
      setViewState('path');
    }
  };

  const handleFinishQuiz = (topicId: string, earnedXp: number, perfectScore: boolean) => {
    if (!perfectScore) {
      // If not perfect, we don't save progress, simply navigate back
      setViewState('path');
      return;
    }

    const isAlreadyCompleted = progress.completedTopics.includes(topicId);
    const newCompletedTopics = isAlreadyCompleted 
      ? progress.completedTopics 
      : [...progress.completedTopics, topicId];

    const today = new Date().toDateString();
    saveProgress({
      ...progress,
      completedTopics: newCompletedTopics,
      xp: progress.xp + earnedXp,
      lastStudyDate: today
    });
    
    setViewState('path');
  };

  // Sync with LocalStorage
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('integralfood_progress', JSON.stringify(newProgress));
  };

  const navigate = (v: ViewState, topic?: Topic) => {
    if (topic) setActiveTopic(topic);
    setViewState(v);
  };

  const totalTopics = topics.length;
  const completedCount = progress.completedTopics.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalTopics) * 100));

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between py-6 shrink-0 z-10 hidden sm:flex">
        <div>
          <div className="px-4 md:px-8 mb-8 cursor-pointer select-none" onClick={() => navigate('path')} title="Volver a la ruta de aprendizaje">
            <h1 className="text-green-600 font-extrabold text-2xl tracking-tight hidden md:block hover:text-green-700 transition-colors">IntegralFood</h1>
            <h1 className="text-green-600 font-extrabold text-2xl tracking-tight md:hidden text-center hover:text-green-700 transition-colors">IF</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-1 uppercase hidden md:block">Por Ing. Luis Gomez</p>
          </div>
          <nav className="flex flex-col gap-2 px-2 md:px-4">
            <SidebarItem icon={<Map size={24} />} label="Ruta" active={view === 'path' || view === 'lesson' || view === 'quiz'} onClick={() => navigate('path')} />
            <SidebarItem icon={<BrainCircuit size={24} />} label="Flashcards" active={view === 'flashcards'} onClick={() => navigate('flashcards')} />
            <SidebarItem icon={<ClipboardCheck size={24} />} label="Evaluación" active={view === 'evaluations'} onClick={() => navigate('evaluations')} />
            <SidebarItem id="tour-desktop-casos" icon={<HelpCircle size={24} />} label="Casos Aplicados" active={view === 'casos_aplicados'} onClick={() => navigate('casos_aplicados')} />
            <SidebarItem icon={<Bot size={24} />} label="Profe IA" active={view === 'ai'} onClick={() => navigate('ai')} />
          </nav>
        </div>

        <div className="px-4 hidden md:block text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          💡 Estudia con el Ing. Gomez
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-full w-full flex flex-col">
        
        {/* Sticky Persistent Top Progress Bar & Stats Component */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-30 px-4 py-3 sm:px-8 shadow-sm">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
            
            {/* User Greeting and Name Input */}
            <div className="flex items-center gap-3 w-full sm:w-auto relative">
              <div className="relative group">
                <button 
                  onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                  className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 font-black text-lg shadow-inner hover:bg-green-200 transition-all cursor-pointer relative border border-green-200"
                  title="Cambiar avatar o ícono"
                >
                  {progress.userAvatar || '🥗'}
                  <div className="absolute -bottom-1 -right-1 bg-white border border-slate-200 rounded-full p-0.5 shadow-sm text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✏️
                  </div>
                </button>

                {isEditingAvatar && (
                  <div className="absolute top-12 left-0 bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-xl z-50 w-52 grid grid-cols-5 gap-2 animate-in zoom-in-95 duration-150">
                    <div className="col-span-5 text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1">
                      Elige tu Ícono / Avatar:
                    </div>
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        onClick={() => handleSelectAvatar(av)}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center text-base rounded-lg hover:bg-slate-100 active:scale-95 transition-all",
                          progress.userAvatar === av && "bg-green-100 border border-green-400"
                        )}
                      >
                        {av}
                      </button>
                    ))}
                    <button 
                      onClick={() => setIsEditingAvatar(false)}
                      className="col-span-5 text-center text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold uppercase py-1 rounded-md mt-1 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  {isEditingName ? (
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        value={nameInput} 
                        onChange={(e) => setNameInput(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        className="bg-slate-100 border-2 border-green-500 rounded px-2 py-0.5 text-sm font-bold text-slate-700 outline-none focus:bg-white"
                        autoFocus
                      />
                      <button onClick={handleSaveName} className="text-green-600 hover:text-green-700 p-1">
                        <Check size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-extrabold text-slate-800 text-sm sm:text-base">{progress.userName}</span>
                      <button onClick={() => setIsEditingName(true)} className="text-slate-400 hover:text-slate-600 p-0.5">
                        <Edit2 size={13} />
                      </button>
                    </>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Ingeniería de Alimentos</span>
              </div>
            </div>

            {/* Duolingo Style Progress Indicators */}
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              
              {/* Daily Streak */}
              <div className="flex items-center gap-1.5" title="Días consecutivos de estudio">
                <Flame className="text-orange-500 animate-pulse fill-orange-500" size={20} />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1">
                  <span className="font-black text-slate-800 text-sm sm:text-base">{progress.streak}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-extrabold uppercase">Racha</span>
                </div>
              </div>

              {/* Total XP Score */}
              <div className="flex items-center gap-1.5" title="Puntos de Experiencia acumulados en desafíos">
                <Zap className="text-yellow-500 fill-yellow-500" size={20} />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1">
                  <span className="font-black text-slate-800 text-sm sm:text-base">{progress.xp}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-extrabold uppercase">XP</span>
                </div>
              </div>

              {/* Topics Completed & Bar */}
              <div className="flex flex-col items-end gap-1 min-w-[120px] sm:min-w-[150px]">
                <div className="flex items-center gap-1">
                  <Award className="text-green-600" size={16} />
                  <span className="text-xs text-slate-500 font-extrabold">
                    {completedCount} / {totalTopics} Temas
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full border border-slate-200 overflow-hidden relative" title={`Progreso del curso: ${progressPercent}%`}>
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 rounded-full" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-green-800">
                    {progressPercent}%
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Header (replaces standard header) */}
        <header className="sm:hidden bg-white border-b border-slate-200 px-4 py-3 sticky top-12 z-20 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 
              className="text-green-600 font-extrabold text-lg tracking-tight cursor-pointer hover:text-green-700 transition-colors"
              onClick={() => navigate('path')}
              title="Volver a la ruta de aprendizaje"
            >
              IntegralFood
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Ing. Gomez</span>
              <button 
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-sm shadow-inner border border-green-200"
                title="Cambiar avatar"
              >
                {progress.userAvatar || '🥗'}
              </button>
            </div>
          </div>
          <div className="flex justify-around text-slate-400 border-t border-slate-100 pt-2 text-[11px]">
             <button onClick={() => navigate('path')} className={cn("flex flex-col items-center gap-1", (view === 'path' || view === 'lesson' || view === 'quiz') && "text-green-600 font-bold")}>
               <Map size={18} />
               <span>Ruta</span>
             </button>
             <button onClick={() => navigate('flashcards')} className={cn("flex flex-col items-center gap-1", view === 'flashcards' && "text-indigo-600 font-bold")}>
               <BrainCircuit size={18} />
               <span>Cards</span>
             </button>
             <button onClick={() => navigate('evaluations')} className={cn("flex flex-col items-center gap-1", view === 'evaluations' && "text-purple-600 font-bold")}>
               <ClipboardCheck size={18} />
               <span>Eval</span>
             </button>
             <button id="tour-mobile-casos" onClick={() => navigate('casos_aplicados')} className={cn("flex flex-col items-center gap-1", view === 'casos_aplicados' && "text-pink-600 font-bold")}>
               <HelpCircle size={18} />
               <span>Casos</span>
             </button>
             <button onClick={() => navigate('ai')} className={cn("flex flex-col items-center gap-1", view === 'ai' && "text-blue-600 font-bold")}>
               <Bot size={18} />
               <span>Profe IA</span>
             </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 pb-36">
          {view === 'path' && (
            <PathView 
              completedTopics={progress.completedTopics} 
              onSelect={(t) => navigate('lesson', t)} 
              formulaIdx={formulaIndex}
              onChangeFormula={() => setFormulaIndex((prev) => (prev + 1) % formulasOfTheDay.length)}
            />
          )}
          {view === 'evaluations' && (
            <EvaluationsView 
              completedTopics={progress.completedTopics}
              userName={progress.userName}
              onUpdateName={(newName) => {
                saveProgress({
                  ...progress,
                  userName: newName
                });
              }}
              onSelectTopic={(t) => navigate('lesson', t)}
              onLaunchChallenge={(t) => navigate('quiz', t)}
            />
          )}
          {view === 'lesson' && activeTopic && (
            <LessonView 
              topic={activeTopic} 
              isCompleted={progress.completedTopics.includes(activeTopic.id)}
              onBack={() => navigate('path')} 
              onQuiz={() => navigate('quiz', activeTopic)} 
            />
          )}
          {view === 'quiz' && activeTopic && (
            <QuizView 
              quiz={quizzes[activeTopic.quizId!]} 
              topicId={activeTopic.id}
              topicTitle={activeTopic.title}
              onBack={() => navigate('lesson', activeTopic)} 
              onFinish={(earnedXp, perfectScore) => handleFinishQuiz(activeTopic.id, earnedXp, perfectScore)} 
            />
          )}
          {view === 'ai' && <AIProfeView />}
          {view === 'flashcards' && <FlashcardsWidget />}
          {view === 'casos_aplicados' && <AppliedCasesView />}
        </div>
      </main>
      <GuidedTutorial />
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, id }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; id?: string }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-3.5 rounded-2xl transition-all font-black tracking-wide w-full justify-center md:justify-start border-b-4",
        active 
          ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-100" 
          : "text-slate-500 hover:bg-slate-100 border-transparent hover:border-slate-200"
      )}
    >
      {icon}
      <span className="hidden md:block uppercase text-xs tracking-wider">{label}</span>
    </button>
  );
}

function PathView({ 
  completedTopics, 
  onSelect, 
  formulaIdx, 
  onChangeFormula 
}: { 
  completedTopics: string[]; 
  onSelect: (topic: Topic) => void; 
  formulaIdx: number;
  onChangeFormula: () => void;
}) {
  const currentFormula = formulasOfTheDay[formulaIdx];

  return (
    <div className="flex flex-col items-center py-4 relative">
      
      {/* Banner / Header */}
      <div className="w-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8 border-b-4 border-green-700 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="bg-green-400/30 text-green-100 font-extrabold uppercase text-[10px] tracking-widest px-2.5 py-1 rounded-full border border-green-300/20">
            Escuela de Ingeniería de Alimentos
          </span>
          <h2 className="text-3xl font-black mt-2 mb-1">Cálculo Integral Aplicado</h2>
          <p className="text-green-100 text-sm font-medium leading-relaxed">
            Creado por el **Ingeniero Luis Gomez**. Domina la integración con problemas y explicaciones detalladas adaptados a procesos biológicos, térmicos y de fluidos de la industria alimentaria.
          </p>
        </div>
        <div className="absolute -right-4 -bottom-6 text-9xl opacity-15 pointer-events-none select-none font-black">
          ∫
        </div>
      </div>

      {/* Elegant Formula of the Day Widget */}
      <div className="w-full bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm mb-12 relative overflow-hidden hover:border-blue-300 transition-colors">
        <div className="absolute top-0 right-0 bg-blue-500 text-white font-extrabold uppercase text-[9px] tracking-widest px-3 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1">
          <Zap size={11} className="fill-white" /> Fórmula del Día
        </div>
        
        <div className="max-w-2xl">
          <h4 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-1.5">
            {currentFormula.title}
          </h4>
          
          {/* LaTeX render box */}
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl my-4 flex items-center justify-center overflow-x-auto shadow-inner">
            <div className="text-xl sm:text-2xl text-slate-800 font-bold">
              <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {`$$${currentFormula.formula}$$`}
              </Markdown>
            </div>
          </div>

          <p className="text-slate-600 text-sm font-bold leading-relaxed mb-3">
            <span className="text-blue-600 uppercase text-[10px] font-black tracking-wider block mb-0.5">Aplicación en Alimentos:</span>
            {currentFormula.engineeringApplication}
          </p>

          <p className="text-slate-500 text-xs italic bg-blue-50/50 p-3 rounded-xl border border-blue-100/40">
            <strong className="text-blue-700 not-italic uppercase text-[9px] font-black tracking-widest block mb-0.5">Clave de Resolución:</strong>
            {currentFormula.solutionHighlight}
          </p>
        </div>

        <button 
          onClick={onChangeFormula}
          className="mt-4 flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-black uppercase tracking-wider transition-colors bg-blue-50 hover:bg-blue-100/70 px-3.5 py-2 rounded-xl"
        >
          <RefreshCw size={14} /> Siguiente Fórmula Desafiante
        </button>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Tu Ruta de Aprendizaje</h3>
        <p className="text-xs text-slate-500 font-bold">Domina cada nivel con puntuación perfecta para avanzar</p>
      </div>

      {/* Snake Path */}
      <div className="relative w-full max-w-lg flex flex-col items-center">
        {/* Connecting Line */}
        <div className="absolute top-8 bottom-8 w-2 bg-slate-200 rounded-full"></div>
        
        {topics.map((topic, index) => {
          const isCompleted = completedTopics.includes(topic.id);
          // Snake offsets
          const offset = Math.sin(index * 1.5) * 75;
          const isNextUnlockable = index === 0 || completedTopics.includes(topics[index - 1].id);

          return (
            <div 
              key={topic.id} 
              className="relative my-7 flex flex-col items-center" 
              style={{ transform: `translateX(${offset}px)` }}
            >
              {/* Tooltip on hover */}
              <div className="group relative flex flex-col items-center">
                <button
                  id={index === 0 ? "tour-path-node-1" : undefined}
                  onClick={() => onSelect(topic)}
                  disabled={!isNextUnlockable}
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 relative z-10 border-b-8 active:translate-y-1 active:border-b-4",
                    isCompleted 
                      ? "bg-green-500 border-green-700 hover:bg-green-400 shadow-lg" 
                      : isNextUnlockable
                        ? "bg-blue-500 border-blue-700 hover:bg-blue-400 animate-pulse shadow-md"
                        : "bg-slate-300 border-slate-400 cursor-not-allowed opacity-80"
                  )}
                >
                  {isCompleted ? (
                    <Trophy size={32} className="text-yellow-200" />
                  ) : (
                    <span className="font-black text-xl">{index + 1}</span>
                  )}
                </button>

                {/* Info Card beneath button */}
                <div className="absolute top-22 w-48 text-center bg-white p-2.5 rounded-2xl border-2 border-slate-200 shadow-sm z-20 pointer-events-none transition-all group-hover:scale-105">
                  <p className="font-extrabold text-xs text-slate-800 line-clamp-1">{topic.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    {isCompleted ? '¡Completado!' : isNextUnlockable ? '¡Disponible!' : 'Bloqueado'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EvaluationsView({ 
  completedTopics, 
  userName,
  onUpdateName,
  onSelectTopic,
  onLaunchChallenge 
}: { 
  completedTopics: string[]; 
  userName: string;
  onUpdateName: (name: string) => void;
  onSelectTopic: (topic: Topic) => void;
  onLaunchChallenge: (topic: Topic) => void;
}) {
  const [localName, setLocalName] = React.useState(userName);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    setLocalName(userName);
  }, [userName]);

  const handleSave = () => {
    if (localName.trim()) {
      onUpdateName(localName.trim());
    }
    setIsEditing(false);
  };

  const totalExams = topics.length;
  const completedExams = completedTopics.length;
  const percentage = Math.min(100, Math.round((completedExams / totalExams) * 100));

  return (
    <div className="animate-in slide-in-from-bottom-8 fade-in duration-300">
      
      {/* Evaluations Header Banner */}
      <div className="w-full bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-6 border-b-4 border-purple-700 relative overflow-hidden">
        <ClipboardCheck size={120} className="absolute -right-4 -bottom-8 opacity-20 text-black pointer-events-none" />
        <h2 className="text-3xl font-black mb-1 relative z-10">Módulo de Evaluaciones</h2>
        <p className="font-bold text-purple-100 max-w-md relative z-10 text-sm leading-relaxed">
          ¿Listo para poner a prueba tus conocimientos? Selecciona cualquier tema para realizar su examen rápido directamente. Recuerda: el Ing. Luis Gomez exige **100% de aciertos** para otorgar la medalla de dominio.
        </p>
      </div>

      {/* Student Profile & Progress Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="w-full md:w-auto flex-1">
          <span className="text-[10px] text-purple-600 font-extrabold uppercase tracking-widest block mb-1">Perfil del Estudiante</span>
          <div className="flex items-center gap-2 mb-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={localName} 
                  onChange={(e) => setLocalName(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="bg-slate-50 border-2 border-purple-500 rounded-xl px-3 py-1.5 text-base font-black text-slate-800 outline-none focus:bg-white"
                  autoFocus
                />
                <button 
                  onClick={handleSave}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-2.5 rounded-xl transition-colors shadow-sm"
                  title="Guardar Nombre"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-800">{userName}</h3>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-slate-400 hover:text-purple-600 p-1.5 rounded-lg hover:bg-slate-50 transition-all"
                  title="Editar Nombre"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">
            Tu nombre se guardará en tu navegador interno de forma persistente para registrar tus logros académicos.
          </p>
        </div>

        {/* Academic Progress Meter */}
        <div className="w-full md:w-64 bg-slate-50 rounded-2xl p-4 border border-slate-100 shrink-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-500 font-extrabold uppercase">Avance Evaluaciones</span>
            <span className="text-xs font-black text-purple-600">{completedExams} / {totalExams}</span>
          </div>
          <div className="w-full h-3 bg-slate-200/60 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-purple-500 transition-all duration-500 rounded-full" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-1.5 block text-right">
            {percentage}% Completado
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic, index) => {
          const isCompleted = completedTopics.includes(topic.id);
          const isUnlocked = index === 0 || completedTopics.includes(topics[index - 1].id);
          
          return (
            <div 
              key={topic.id}
              className={cn(
                "bg-white border-2 rounded-3xl p-5 shadow-sm transition-all flex flex-col justify-between",
                isUnlocked ? "border-slate-200 hover:border-purple-300" : "border-slate-100 opacity-70"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">TEMA {index + 1}</span>
                  {isCompleted ? (
                    <span className="bg-green-100 text-green-700 border border-green-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Trophy size={10} /> Dominado
                    </span>
                  ) : isUnlocked ? (
                    <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      Disponible
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-400 border border-slate-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      🔒 Bloqueado
                    </span>
                  )}
                </div>

                <h4 className="text-base font-black text-slate-800 mb-1">{topic.title}</h4>
                <p className="text-slate-500 text-xs font-bold leading-relaxed mb-4 line-clamp-2">
                  {topic.description}
                </p>
              </div>

              <div className="flex gap-2.5 mt-2">
                <button 
                  onClick={() => onSelectTopic(topic)}
                  disabled={!isUnlocked}
                  className={cn(
                    "flex-1 font-extrabold text-xs py-3 rounded-xl border-b-2 transition-all uppercase tracking-wider",
                    isUnlocked 
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300" 
                      : "bg-slate-50 text-slate-300 border-transparent cursor-not-allowed"
                  )}
                >
                  Ver Teoría
                </button>
                <button 
                  onClick={() => onLaunchChallenge(topic)}
                  disabled={!isUnlocked}
                  className={cn(
                    "flex-1 font-extrabold text-xs py-3 rounded-xl border-b-4 transition-all uppercase tracking-wider text-white",
                    isUnlocked 
                      ? "bg-purple-500 hover:bg-purple-400 border-purple-700 active:border-b-2 active:translate-y-0.5" 
                      : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed"
                  )}
                  title={isUnlocked ? "Comenzar Examen" : "Debes dominar el tema anterior primero"}
                >
                  {isUnlocked ? "Tomar Examen" : "🔒 Bloqueado"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonView({ topic, isCompleted, onBack, onQuiz }: { topic: Topic; isCompleted: boolean; onBack: () => void; onQuiz: () => void }) {
  const [activeTab, setActiveTab] = React.useState<'theory' | 'converter' | 'plotter'>('theory');

  return (
    <div className="animate-in slide-in-from-bottom-8 fade-in duration-300">
      <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-bold uppercase text-xs flex items-center gap-2 mb-6 transition-colors">
        <X size={18} /> Regresar a la ruta
      </button>
      
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-slate-200 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className={cn("inline-flex p-4 rounded-2xl text-white self-start", topic.color)}>
            <BookOpen size={28} />
          </div>
          {isCompleted && (
            <span className="bg-green-100 text-green-700 font-extrabold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-green-200 flex items-center gap-1.5 self-start">
              <Trophy size={14} className="text-green-600" /> Tema Dominado
            </span>
          )}
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-2">{topic.title}</h2>
        <p className="text-slate-500 font-bold mb-6 text-base sm:text-lg leading-relaxed">{topic.description}</p>
        
        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 mb-6 gap-6 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
          <button 
            onClick={() => setActiveTab('theory')}
            className={cn(
              "pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-b-2",
              activeTab === 'theory' 
                ? "border-green-500 text-green-600" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            📚 Teoría y Laboratorio
          </button>
          <button 
            onClick={() => setActiveTab('plotter')}
            className={cn(
              "pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-b-2",
              activeTab === 'plotter' 
                ? "border-green-500 text-green-600" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            📊 Trazador de Integrales
          </button>
          <button 
            onClick={() => setActiveTab('converter')}
            className={cn(
              "pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-b-2",
              activeTab === 'converter' 
                ? "border-green-500 text-green-600" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            ⚙️ Convertidor Industrial
          </button>
        </div>

        {activeTab === 'theory' ? (
          <>
            <div className="prose prose-slate max-w-none bg-slate-50 p-5 sm:p-8 rounded-3xl border-2 border-slate-200/60 shadow-inner mb-8">
              <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {topic.theory}
              </Markdown>
            </div>

            <InteractiveSimulator topicId={topic.id} />
          </>
        ) : activeTab === 'plotter' ? (
          <IntegralPlotter />
        ) : (
          <IndustrialConverter />
        )}
      </div>

      {topic.quizId && quizzes[topic.quizId] ? (
        <button 
          onClick={onQuiz}
          className="w-full bg-green-500 hover:bg-green-400 text-white font-extrabold text-lg sm:text-xl py-5 rounded-2xl 
                     shadow-[0_8px_0_0_#15803d] active:shadow-none active:translate-y-[8px] transition-all uppercase tracking-wider"
        >
          {isCompleted ? 'Volver a Jugar Reto (+10 XP)' : 'Iniciar Reto del Tema (+50 XP)'}
        </button>
      ) : (
        <div className="bg-amber-50 border-2 border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={24} className="shrink-0 text-amber-500" />
          <p className="text-sm font-bold">Desafío en preparación. Próximamente disponible.</p>
        </div>
      )}
    </div>
  );
}

function QuizView({ 
  quiz, 
  topicId, 
  topicTitle, 
  onBack, 
  onFinish 
}: { 
  quiz: Quiz; 
  topicId: string; 
  topicTitle: string; 
  onBack: () => void; 
  onFinish: (xp: number, perfectScore: boolean) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-800 p-6 rounded-3xl">
        <h3 className="text-xl font-bold mb-2">Error de Reto</h3>
        <p className="font-medium">No se encontraron preguntas para este tema.</p>
        <button onClick={onBack} className="mt-4 bg-red-600 text-white font-bold px-4 py-2 rounded-xl">Regresar</button>
      </div>
    );
  }

  const q = quiz.questions[currentIdx];
  const isCorrect = selected === q.correctAnswer;

  const handleCheck = () => {
    if (selected === null) return;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const totalQuestions = quiz.questions.length;
  const perfectScore = correctCount === totalQuestions;
  const finalXpEarned = perfectScore ? 50 : 0;

  if (quizFinished) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 max-w-lg mx-auto bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-md text-center">
        {perfectScore ? (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-6 shadow-inner animate-bounce">
              <Trophy size={48} />
            </div>
            <h3 className="text-2xl font-black text-green-600 mb-2">¡Puntuación Perfecta!</h3>
            <p className="text-slate-500 font-bold text-sm mb-6 uppercase tracking-wider">{topicTitle}</p>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 font-bold uppercase">Puntaje</span>
                <span className="text-2xl font-black text-green-600">{correctCount} / {totalQuestions}</span>
                <span className="text-[10px] text-slate-400 font-bold">100% de Aciertos</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-200">
                <span className="text-xs text-slate-400 font-bold uppercase">Premio</span>
                <span className="text-2xl font-black text-yellow-500 flex items-center gap-1">
                  +{finalXpEarned} <Zap size={18} className="fill-yellow-500 text-yellow-500" />
                </span>
                <span className="text-[10px] text-slate-400 font-bold">XP Acumulados</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-left text-green-800 text-xs font-semibold mb-8">
              <p className="italic">
                "¡Excelente dominio académico! Has resuelto de forma perfecta cada reto de este tema. Ahora estás preparado para aplicar estos balances de materia y energía en la planta piloto."
              </p>
              <p className="text-[10px] text-green-600 font-bold mt-2 uppercase">— Ing. Luis Gomez</p>
            </div>

            <button
              onClick={() => onFinish(finalXpEarned, true)}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-extrabold py-4 rounded-2xl 
                         shadow-[0_6px_0_0_#15803d] active:shadow-none active:translate-y-[6px] transition-all uppercase tracking-wider"
            >
              Guardar y Avanzar en la Ruta
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner">
              <AlertTriangle size={48} />
            </div>
            <h3 className="text-2xl font-black text-red-600 mb-1">Reto No Superado</h3>
            <p className="text-slate-500 font-bold text-xs mb-6 uppercase tracking-wider">{topicTitle}</p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Tu Puntaje</span>
              <span className="text-3xl font-black text-red-500">{correctCount} / {totalQuestions}</span>
              <span className="text-xs text-slate-500 font-bold block mt-2">
                Para avanzar de tema, el Ing. Luis Gomez exige una **puntuación perfecta (100% de aciertos)**.
              </span>
            </div>

            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 text-left text-red-800 text-xs font-semibold mb-8">
              <p className="italic">
                "Cometer errores es parte del aprendizaje, pero en la industria de alimentos un cálculo erróneo puede comprometer la inocuidad. Te sugiero repasar la teoría detalladamente y volver a intentarlo."
              </p>
              <p className="text-[10px] text-red-600 font-bold mt-2 uppercase">— Ing. Luis Gomez</p>
            </div>

            <button
              onClick={() => onFinish(0, false)}
              className="w-full bg-red-500 hover:bg-red-400 text-white font-extrabold py-4 rounded-2xl 
                         shadow-[0_6px_0_0_#b91c1c] active:shadow-none active:translate-y-[6px] transition-all uppercase tracking-wider"
            >
              Volver a Repasar Teoría
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-8 fade-in duration-300 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={28} /></button>
          <div className="flex-1 mx-8 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(currentIdx / totalQuestions) * 100}%` }} />
          </div>
          <span className="text-slate-500 font-black text-sm">{currentIdx + 1} / {totalQuestions}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-slate-200 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-relaxed">
            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{q.text}</Markdown>
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            let btnClass = "border-2 border-slate-200 hover:bg-slate-100 text-slate-700 shadow-[0_4px_0_0_#cbd5e1]";
            
            if (isSelected) {
              btnClass = "border-2 border-blue-500 bg-blue-50 text-blue-600 shadow-[0_4px_0_0_#3b82f6]";
            }
            if (showFeedback && i === q.correctAnswer) {
              btnClass = "border-2 border-green-500 bg-green-50 text-green-700 shadow-[0_4px_0_0_#22c55e]";
            }
            if (showFeedback && isSelected && !isCorrect) {
              btnClass = "border-2 border-red-500 bg-red-50 text-red-700 shadow-[0_4px_0_0_#ef4444]";
            }

            return (
              <button
                key={i}
                disabled={showFeedback}
                onClick={() => setSelected(i)}
                className={cn("p-4 sm:p-5 rounded-2xl font-bold text-base sm:text-lg text-left transition-all active:translate-y-1 active:shadow-none", btnClass)}
              >
                <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{opt}</Markdown>
              </button>
            );
          })}
        </div>
      </div>

      {showFeedback && (
        <div className={cn("fixed bottom-0 left-0 right-0 p-6 md:pl-72 border-t-4 animate-in slide-in-from-bottom flex flex-col md:flex-row gap-4 items-center justify-between z-40",
          isCorrect ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"
        )}>
          <div className="flex flex-col max-w-xl">
            <h3 className={cn("font-black text-2xl mb-1 flex items-center gap-2", isCorrect ? "text-green-700" : "text-red-700")}>
              {isCorrect ? <><CheckCircle2 className="fill-green-200 text-green-700" /> ¡Buenísimo!</> : <><X className="text-red-700" /> Incorrecto</>}
            </h3>
            <div className={cn("font-semibold text-sm", isCorrect ? "text-green-800" : "text-red-800")}>
              <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{q.explanation}</Markdown>
            </div>
          </div>
          <button
            onClick={handleNext}
            className={cn("w-full md:w-auto px-10 py-4 rounded-2xl font-extrabold text-lg text-white uppercase tracking-wider transition-all active:translate-y-1 shadow-[0_4px_0_0_rgba(0,0,0,0.15)] shrink-0",
              isCorrect ? "bg-green-600 hover:bg-green-500 shadow-[0_4px_0_0_#15803d]" : "bg-red-600 hover:bg-red-500 shadow-[0_4px_0_0_#b91c1c]"
            )}
          >
            Continuar
          </button>
        </div>
      )}
      
      {!showFeedback && (
        <div className="fixed bottom-0 left-0 right-0 p-6 md:pl-72 bg-white border-t-2 border-slate-200 z-30 flex justify-end">
           <button
            disabled={selected === null}
            onClick={handleCheck}
            className={cn("w-full md:w-auto px-12 py-4 rounded-2xl font-extrabold text-lg text-white uppercase tracking-wider transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.15)]",
              selected !== null 
                ? "bg-green-500 hover:bg-green-400 shadow-[0_4px_0_0_#15803d] active:translate-y-1 active:shadow-none" 
                : "bg-slate-300 shadow-[0_4px_0_0_#cbd5e1] cursor-not-allowed"
            )}
          >
            Comprobar
          </button>
        </div>
      )}
    </div>
  );
}

const FOOD_ENGINEERING_CASES = [
  {
    title: "Balance de Masa (Evaporación)",
    description: "Concentración de jugo de naranja de 12% a 65% Brix.",
    prompt: "Un evaporador continuo de triple efecto se alimenta con F = 10000 kg/h de jugo de naranja que tiene un contenido inicial de sólidos del 12% (0.12 en fracción de masa). Se desea concentrar el jugo hasta que alcance un 65% de sólidos (0.65 en fracción de masa). \n\n1. Plantea el balance global de masa y el balance de sólidos para este evaporador.\n2. Calcula analíticamente el flujo masivo de salida del jugo concentrado (P en kg/h) y el flujo de agua evaporada (V en kg/h).\n3. Explica brevemente la importancia de controlar los sólidos solubles (Brix) en la industria de bebidas."
  },
  {
    title: "Balance de Energía (Pasteurización)",
    description: "Cálculo del calor requerido para pasteurizar leche en placas.",
    prompt: "Se pasteuriza leche entera con un caudal volumétrico de Q = 5000 L/h, calentándola de forma continua desde una temperatura inicial Ti = 4°C hasta la temperatura de pasteurización Tf = 72°C en un intercambiador de calor de placas.\n\nDatos:\n- Densidad promedio de la leche: rho = 1030 kg/m^3 (1.03 kg/L)\n- Calor específico de la leche: Cp = 3.89 kJ/(kg*°C)\n\n1. Calcula el flujo de masa de la leche que circula por el sistema (m en kg/h y kg/s).\n2. Mediante la ecuación integral/diferencial de balance de calor q = m * Cp * (Tf - Ti), calcula la tasa de transferencia de calor requerida en el intercambiador en kJ/h y expresada en kW.\n3. ¿Qué impacto tiene la correcta calibración de temperatura en la inocuidad y características organolépticas del producto?"
  },
  {
    title: "Cinética de Secado (Manzanas)",
    description: "Integración de la ecuación de secado de primer orden.",
    prompt: "En un secador de bandejas para láminas de manzana, la tasa de pérdida de humedad sigue una cinética de primer orden descrita por la ecuación diferencial:\n\ndX/dt = -k * (X - Xe)\n\nDonde:\n- X es la humedad del producto en base seca en el tiempo t (horas).\n- Xe es la humedad de equilibrio, que para las condiciones de aire dadas es Xe = 0.05 kg agua/kg sólido seco.\n- k es la constante de velocidad de secado, igual a k = 0.15 h^-1.\n- La humedad inicial al entrar al secador es X0 = 4.5 kg agua/kg sólido seco.\n\n1. Resuelve la ecuación diferencial por separación de variables para obtener la función analítica X(t).\n2. Calcula el contenido de humedad (X) de las láminas de manzana después de t = 5 horas de secado continuo.\n3. Explica el concepto de humedad de equilibrio y base seca en tecnología de alimentos."
  },
  {
    title: "Sólidos de Revolución (Silo de Café)",
    description: "Cálculo de volumen de tolva usando el método de discos.",
    prompt: "Se desea diseñar un silo de almacenamiento de granos de café verde. El perfil lateral inferior del silo se modela haciendo rotar la curva y = 0.5 * x^2 alrededor del eje Y, desde x = 0 hasta x = 4 decímetros (donde 1 decímetro cúbico es exactamente 1 litro).\n\n1. Plantea la integral utilizando el método de discos/arandelas (integrando respecto a y) o el método de capas/cascarones cilíndricos (integrando respecto a x) para hallar el volumen encerrado por el sólido de revolución.\n2. Calcula el volumen total de café en decímetros cúbicos (litros) que el silo puede contener.\n3. Convierte el resultado a metros cúbicos y explica cómo influye el ángulo de reposo de los granos en el diseño de tolvas industriales."
  }
];

function AIProfeView() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!prompt && !image) return;
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt, imageBase64: image }),
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setResponse(data.result);
    } catch (err) {
      setError('Ocurrió un error al contactar al Profe IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-8 fade-in duration-300 h-full flex flex-col">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-6 relative overflow-hidden border-b-4 border-blue-700">
        <Bot size={120} className="absolute -right-4 -bottom-8 opacity-20 text-black pointer-events-none" />
        <h2 className="text-3xl font-black mb-2 relative z-10">Profe IA de Alimentos</h2>
        <p className="font-bold text-blue-100 max-w-md relative z-10 leading-relaxed text-sm sm:text-base">
          Sube la foto de tu problema matemático o escríbelo directamente. Te explicaré el paso a paso detallado, con un enfoque ameno y adaptado a procesos de ingeniería de alimentos.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-slate-200 flex-1 flex flex-col min-h-[400px]">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-2xl mb-4 font-bold text-sm flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}
        
        {response ? (
          <div className="flex-1 overflow-y-auto mb-6">
            <div className="bg-slate-50 border-2 border-slate-200 p-5 sm:p-8 rounded-2xl prose prose-slate max-w-none
                            prose-headings:text-slate-800 prose-p:leading-relaxed shadow-inner">
              <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{response}</Markdown>
            </div>
            <button onClick={() => {setResponse(''); setImage(null); setPrompt('');}} 
                    className="mt-6 font-black text-blue-600 hover:text-blue-700 uppercase text-xs tracking-wider flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 px-4 py-2.5 rounded-xl transition-all">
               <RotateCcw size={16} /> Hacer otra consulta
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-5">
             <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Determina el volumen de un silo para granos de café generado por la revolución de la función y = x^2 entre x=0 y x=3..."
              className="flex-1 w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl resize-none focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 font-semibold text-base shadow-inner min-h-[160px]"
            />

            {/* Selector de Casos de Estudio Reales */}
            <div className="bg-blue-50/50 border-2 border-blue-100 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
              <label className="text-xs font-black text-blue-800 uppercase tracking-widest flex items-center gap-1">
                🔬 Cargar Caso de Estudio Real (Ingeniería de Alimentos):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {FOOD_ENGINEERING_CASES.map((caseStudy, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPrompt(caseStudy.prompt)}
                    className="p-3 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm flex flex-col justify-between"
                  >
                    <span className="font-extrabold text-xs text-blue-700 mb-0.5 line-clamp-1">{caseStudy.title}</span>
                    <span className="text-[10px] text-slate-400 font-bold line-clamp-2 leading-tight">{caseStudy.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {image && (
              <div className="relative w-max">
                <img src={image} alt="Preview" className="h-32 rounded-2xl border-2 border-slate-200 object-cover shadow-sm" />
                <button onClick={() => setImage(null)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"><X size={16}/></button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 border-2 border-slate-300 border-dashed rounded-2xl py-4 cursor-pointer transition-colors font-bold uppercase text-xs tracking-wider">
                <Upload size={18} />
                <span>Cargar Imagen</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <button 
                onClick={handleSolve}
                disabled={loading || (!prompt && !image)}
                className="flex-[2] bg-blue-500 hover:bg-blue-400 text-white font-black text-base py-4 rounded-2xl shadow-[0_6px_0_0_#1d4ed8] active:shadow-none active:translate-y-[6px] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-[6px] uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? <span className="animate-pulse">Calculando Paso a Paso...</span> : <><MessageSquare size={18} /> Consultar a Profe IA</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
