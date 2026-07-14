import { useEffect, useMemo, useState } from 'react';
import { StudentWork } from '../../types';
import { simulationTelegram } from '../../data/content';
import { buildSimulation } from '../../data/simulationEngine';

interface SimulationProps {
  work: StudentWork;
  update: (patch: Partial<StudentWork>) => void;
}

export default function Simulation({ work, update }: SimulationProps) {
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'done'>(
    work.simulationChoice ? 'done' : 'idle',
  );

  const agentName = work.agentConfig.name.trim() || 'אנליסט צל';
  const sim = useMemo(() => buildSimulation(work), [work]);
  const chosen = work.simulationChoice;

  useEffect(() => {
    if (phase !== 'analyzing') return;
    const t = setTimeout(() => setPhase('done'), 2200);
    return () => clearTimeout(t);
  }, [phase]);

  const rerun = () => {
    update({ simulationChoice: null });
    setPhase('analyzing');
  };

  return (
    <section className="screen">
      <h2 className="screen-title">📡 סימולציה: הסוכן נבחן בשטח</h2>
      <p className="screen-lead">
        שלב 4 של FDE — הערכה והרצה. מברק אמיתי מהמשבר נכנס לחדר המצב.
        הסוכן ינתח אותו <strong>לפי מה שבניתם</strong>: התפקיד, המקורות, המגבלות
        ואיכות הפרומפט. שיניתם משהו בתכנון? הריצו שוב וראו את ההבדל.
      </p>

      <div className="sim-config-chips">
        <span className="sim-chip">🎭 {work.agentConfig.role ? work.agentConfig.role.split(' — ')[0] : 'ללא תפקיד מוגדר'}</span>
        <span className="sim-chip">📚 {work.agentConfig.knowledgeSources.length} מקורות ידע</span>
        <span className="sim-chip">🛡️ {work.agentConfig.safetyLimits.length} מגבלות בטיחות</span>
        <span className={`sim-chip quality-${sim.quality}`}>
          ⌨️ פרומפט: {sim.rubric.total}/{sim.rubric.max}
        </span>
      </div>

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
          <p>"{agentName}" מנתח את המברק לפי {work.agentConfig.knowledgeSources.length || 'אפס'} מקורות הידע שחיברתם אליו...</p>
        </div>
      )}

      {phase === 'done' && (
        <>
          <div className="card agent-output">
            <div className="agent-output-header">
              <span className="agent-avatar">🤖</span>
              <div>
                <h3>ניתוח של הסוכן "{agentName}"</h3>
                <span className="agent-output-sub">פלט מדומה לצורכי תרגול — נבנה מהתכנון שלכם, ללא AI אמיתי</span>
              </div>
            </div>

            <p className="sim-role-flavor">{sim.roleFlavor}</p>
            <p className="agent-summary-line">📌 {sim.summary}</p>

            {sim.facts.length > 0 && (
              <>
                <h4>{sim.separatesFacts ? 'עובדות (מופרדות מהערכות):' : 'ממצאים:'}</h4>
                <ul className="check-list">
                  {sim.facts.map((f) => (
                    <li key={f.text}>
                      {f.text}
                      {sim.showsConfidence && (
                        <span className={`fact-confidence conf-${f.confidence === 'גבוהה' ? 'high' : f.confidence === 'בינונית' ? 'mid' : 'low'}`}>
                          {' '}(ודאות: {f.confidence})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {sim.gaps.length > 0 && (
              <div className="sim-gaps">
                <h4>⚠️ פערי מידע שהסוכן מדווח:</h4>
                <ul className="check-list">
                  {sim.gaps.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            )}

            <h4>{sim.separatesFacts ? 'הערכת כוונות (פרשנות, לא עובדה):' : 'הערכת כוונות:'}</h4>
            <p>{sim.assessment}</p>
          </div>

          <h3 className="section-title">
            🧭 הסוכן מציג {sim.options.length} חלופות פעולה — בחרו המלצה לנשיא
          </h3>
          <div className="action-grid">
            {sim.options.map((a) => (
              <button
                key={a.id}
                className={`card action-card ${chosen === a.id ? 'chosen' : ''}`}
                onClick={() => update({ simulationChoice: a.id })}
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

          {chosen && (
            <div className="debrief">
              <h3 className="section-title">🎙️ תחקיר: מה הסוכן שלכם עשה — ולמה</h3>
              {sim.debrief.map((n) => (
                <div key={n.text} className={`callout debrief-note debrief-${n.kind}`}>
                  <span className="callout-icon">{n.icon}</span>
                  <p>{n.text}</p>
                </div>
              ))}
              <button className="btn btn-ghost" onClick={rerun}>
                🔁 שיניתי את התכנון — הרץ שוב את הסוכן
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
