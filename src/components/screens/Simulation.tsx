import { useEffect, useState } from 'react';
import { AgentConfig } from '../../types';
import { simulationTelegram, agentResponse, actionOptions } from '../../data/content';

interface SimulationProps {
  config: AgentConfig;
}

export default function Simulation({ config }: SimulationProps) {
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [chosen, setChosen] = useState<string | null>(null);

  const agentName = config.name.trim() || 'אנליסט צל';

  useEffect(() => {
    if (phase !== 'analyzing') return;
    const t = setTimeout(() => setPhase('done'), 2200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <section className="screen">
      <h2 className="screen-title">📡 סימולציה: הסוכן נבחן בשטח</h2>
      <p className="screen-lead">
        שלב 4 של FDE — הערכה והרצה. מברק אמיתי מהמשבר נכנס לחדר המצב.
        הפעילו את הסוכן, קראו את הניתוח שלו — ובחרו חלופת פעולה עבור הנשיא.
      </p>

      <article className="telegram incoming">
        <div className="telegram-header">
          <span className="telegram-stamp blink">מברק נכנס · דחוף</span>
          <span className="telegram-id">{simulationTelegram.id}</span>
        </div>
        <div className="telegram-meta">
          <span><strong>מאת:</strong> {simulationTelegram.from}</span>
          <span><strong>אל:</strong> {simulationTelegram.to}</span>
          <span><strong>תאריך:</strong> {simulationTelegram.date}</span>
        </div>
        <p className="telegram-body">{simulationTelegram.body}</p>
      </article>

      {phase === 'idle' && (
        <button className="btn btn-primary btn-large" onClick={() => setPhase('analyzing')}>
          ▶️ הפעלת הסוכן "{agentName}"
        </button>
      )}

      {phase === 'analyzing' && (
        <div className="card analyzing-card">
          <div className="radar"><span /></div>
          <p>
            "{agentName}" מנתח את המברק... מצליב עם תצלומי לוויין... בודק פרופיל
            אישיותי של חרושצ׳וב...
          </p>
        </div>
      )}

      {phase === 'done' && (
        <>
          <div className="card agent-output">
            <div className="agent-output-header">
              <span className="agent-avatar">🤖</span>
              <div>
                <h3>ניתוח של הסוכן "{agentName}"</h3>
                <span className="agent-output-sub">פלט מדומה לצורכי תרגול — כך זה היה נראה</span>
              </div>
            </div>
            <p className="agent-summary-line">📌 {agentResponse.summary}</p>
            <h4>עובדות מרכזיות:</h4>
            <ul className="check-list">
              {agentResponse.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <h4>הערכת כוונות:</h4>
            <p>{agentResponse.assessment}</p>
          </div>

          <h3 className="section-title">🧭 בחרו חלופת פעולה להמלצה לנשיא</h3>
          <div className="action-grid">
            {actionOptions.map((a) => (
              <button
                key={a.id}
                className={`card action-card ${chosen === a.id ? 'chosen' : ''}`}
                onClick={() => setChosen(a.id)}
              >
                <span className="card-icon">{a.icon}</span>
                <h4>{a.title}</h4>
                <p>{a.description}</p>
                <span className={`risk-badge risk-${a.risk === 'נמוך' ? 'low' : a.risk === 'בינוני' ? 'mid' : 'high'}`}>
                  סיכון: {a.risk}
                </span>
                {chosen === a.id && (
                  <div className="action-outcome">
                    <strong>📖 מה אומרת ההיסטוריה?</strong>
                    <p>{a.outcome}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
