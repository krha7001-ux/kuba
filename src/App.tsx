import { useStudentWork } from './hooks/useStudentWork';
import StepNav from './components/StepNav';
import PhaseBanner from './components/PhaseBanner';
import Opening from './components/screens/Opening';
import FdeIntro from './components/screens/FdeIntro';
import Stages from './components/screens/Stages';
import Dossier from './components/screens/Dossier';
import Bottlenecks from './components/screens/Bottlenecks';
import AgentDesigner from './components/screens/AgentDesigner';
import PromptEditor from './components/screens/PromptEditor';
import Simulation from './components/screens/Simulation';
import Reflection from './components/screens/Reflection';
import Comparison from './components/screens/Comparison';
import MissionReport from './components/screens/MissionReport';

export interface Phase {
  id: string;
  label: string;
  short: string;
  desc: string;
  icon: string;
}

export const phases: Phase[] = [
  { id: 'intro', label: 'תדריך', short: 'תדריך', desc: 'היכרות עם המשבר ועם מתודת FDE', icon: '🎖️' },
  { id: 'p1', label: 'שלב 1 · אבחון וכניסה לשטח', short: 'שלב 1', desc: 'לומדים את התיק ומזהים את צוואר הבקבוק', icon: '🔍' },
  { id: 'p2', label: 'שלב 2 · ארכיטקטורת הפתרון', short: 'שלב 2', desc: 'מתכננים את סוכן ה־AI', icon: '📐' },
  { id: 'p3', label: 'שלב 3 · הטמעה', short: 'שלב 3', desc: 'כותבים את פרומפט המערכת', icon: '🛠️' },
  { id: 'p4', label: 'שלב 4 · הערכה והרצה בשטח', short: 'שלב 4', desc: 'מריצים את הסוכן ובוחנים אותו', icon: '📊' },
  { id: 'wrap', label: 'סיכום', short: 'סיכום', desc: 'רפלקציה, תובנות ודוח משימה', icon: '🏁' },
];

export const steps = [
  { id: 'opening', label: 'פתיחה', icon: '🚨', phase: 0 },
  { id: 'fde-intro', label: 'מתודת FDE', icon: '💡', phase: 0 },
  { id: 'stages', label: '4 השלבים', icon: '🗺️', phase: 0 },
  { id: 'dossier', label: 'תיק לקוח', icon: '🗂️', phase: 1 },
  { id: 'bottlenecks', label: 'צווארי בקבוק', icon: '🚧', phase: 1 },
  { id: 'agent', label: 'תכנון סוכן', icon: '🤖', phase: 2 },
  { id: 'prompt', label: 'כתיבת פרומפט', icon: '⌨️', phase: 3 },
  { id: 'simulation', label: 'סימולציה', icon: '📡', phase: 4 },
  { id: 'reflection', label: 'רפלקציה', icon: '🪞', phase: 5 },
  { id: 'comparison', label: 'מה הרווחנו', icon: '🏆', phase: 5 },
  { id: 'report', label: 'דוח משימה', icon: '📋', phase: 5 },
] as const;

export default function App() {
  const { work, update, reset } = useStudentWork();
  const step = Math.min(Math.max(work.step, 0), steps.length - 1);

  const goTo = (i: number) => {
    update({ step: Math.min(Math.max(i, 0), steps.length - 1) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const screens = [
    <Opening onStart={() => goTo(1)} />,
    <FdeIntro />,
    <Stages />,
    <Dossier work={work} update={update} />,
    <Bottlenecks work={work} update={update} />,
    <AgentDesigner work={work} update={update} />,
    <PromptEditor work={work} update={update} />,
    <Simulation work={work} update={update} />,
    <Reflection work={work} update={update} />,
    <Comparison />,
    <MissionReport work={work} goTo={goTo} reset={reset} />,
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-badge">סודי ביותר · TOP SECRET</span>
          <h1 className="header-title">🛰️ חדר מצב: משבר הטילים בקובה</h1>
          <span className="header-sub">הדמיה לימודית · אוקטובר 1962 · מתודת FDE</span>
        </div>
      </header>

      {step > 0 && <StepNav steps={steps} phases={phases} current={step} onSelect={goTo} />}
      {step > 0 && <PhaseBanner phase={phases[steps[step].phase]} phaseIndex={steps[step].phase} />}

      {/* כל המסכים נשארים ב־DOM כדי שעבודת התלמידים (טפסים, בחירות, תשובות) לא תאבד במעבר בין שלבים */}
      <main className="screen-container">
        {screens.map((s, i) => (
          <div key={steps[i].id} className={`screen-slot${i === step ? ' active' : ''}`}>
            {s}
          </div>
        ))}
      </main>

      {step > 0 && (
        <footer className="step-footer">
          <button className="btn btn-ghost" onClick={() => goTo(step - 1)}>
            → הקודם
          </button>
          <span className="step-counter">
            שלב {step} מתוך {steps.length - 1}
          </span>
          {step < steps.length - 1 ? (
            <button className="btn btn-primary" onClick={() => goTo(step + 1)}>
              הבא ←
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => goTo(0)}>
              🔄 חזרה לפתיחה
            </button>
          )}
        </footer>
      )}
    </div>
  );
}
