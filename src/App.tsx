import { useState } from 'react';
import { AgentConfig, emptyAgentConfig } from './types';
import StepNav from './components/StepNav';
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

export const steps = [
  { id: 'opening', label: 'פתיחה', icon: '🚨' },
  { id: 'fde-intro', label: 'מתודת FDE', icon: '💡' },
  { id: 'stages', label: '4 השלבים', icon: '🗺️' },
  { id: 'dossier', label: 'תיק לקוח', icon: '🗂️' },
  { id: 'bottlenecks', label: 'צווארי בקבוק', icon: '🚧' },
  { id: 'agent', label: 'תכנון סוכן', icon: '🤖' },
  { id: 'prompt', label: 'כתיבת פרומפט', icon: '⌨️' },
  { id: 'simulation', label: 'סימולציה', icon: '📡' },
  { id: 'reflection', label: 'רפלקציה', icon: '🪞' },
  { id: 'comparison', label: 'מה הרווחנו', icon: '🏆' },
] as const;

export default function App() {
  const [step, setStep] = useState(0);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(emptyAgentConfig);

  const goTo = (i: number) => {
    setStep(Math.min(Math.max(i, 0), steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const screens = [
    <Opening onStart={() => goTo(1)} />,
    <FdeIntro />,
    <Stages />,
    <Dossier />,
    <Bottlenecks />,
    <AgentDesigner config={agentConfig} onChange={setAgentConfig} />,
    <PromptEditor config={agentConfig} />,
    <Simulation config={agentConfig} />,
    <Reflection />,
    <Comparison />,
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

      {step > 0 && <StepNav steps={steps} current={step} onSelect={goTo} />}

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
              🔄 התחלה מחדש
            </button>
          )}
        </footer>
      )}
    </div>
  );
}
