import { StudentWork } from '../../types';
import { bottleneckOptions, reflectionQuestions } from '../../data/content';
import { evidenceItems } from '../../data/pedagogy';
import { buildSimulation } from '../../data/simulationEngine';
import { assemblePrompt } from '../../data/promptBuilder';

interface MissionReportProps {
  work: StudentWork;
  goTo: (step: number) => void;
  reset: () => void;
}

/** אינדקסים של מסכים להשלמת חלקים חסרים */
const STEP = { bottlenecks: 4, agent: 5, prompt: 6, simulation: 7, reflection: 8 };

export default function MissionReport({ work, goTo, reset }: MissionReportProps) {
  const config = work.agentConfig;
  const sim = buildSimulation(work);

  const bottleneck = bottleneckOptions.find((b) => b.id === work.mainBottleneckId);
  const evidence = evidenceItems.filter((e) => work.evidenceIds.includes(e.id));
  const decision = sim.options.find((o) => o.id === work.simulationChoice);
  const promptText = assemblePrompt(work.promptSections);

  const missing: { label: string; step: number }[] = [];
  if (!bottleneck || evidence.length < 2 || work.bottleneckStatement.trim().length < 20)
    missing.push({ label: 'לוח הראיות (ראיות + צוואר בקבוק + טיעון)', step: STEP.bottlenecks });
  if (!config.name.trim() || !config.role) missing.push({ label: 'תכנון הסוכן', step: STEP.agent });
  if (sim.rubric.total <= 5)
    missing.push({ label: 'שדרוג הפרומפט (הציון עדיין נמוך)', step: STEP.prompt });
  if (!decision) missing.push({ label: 'החלטה בסימולציה', step: STEP.simulation });
  const answeredReflections = reflectionQuestions.filter(
    (q) => (work.reflectionAnswers[q.id] ?? '').trim().length > 0,
  );
  if (answeredReflections.length < reflectionQuestions.length)
    missing.push({ label: 'שאלות הרפלקציה', step: STEP.reflection });

  const confirmReset = () => {
    if (window.confirm('לאתחל את כל הפעילות? כל העבודה שנשמרה תימחק — פעולה שאינה הפיכה.')) {
      reset();
    }
  };

  return (
    <section className="screen report">
      <h2 className="screen-title">📋 דוח משימה: סיכום הפעילות</h2>
      <p className="screen-lead">
        זהו התיק שאתם מגישים בסוף המשימה — מהאבחון ועד ההחלטה. אפשר להדפיס
        ולהגיש למורה, או להציג בדיון כיתתי.
      </p>

      {missing.length > 0 && (
        <div className="callout report-missing">
          <span className="callout-icon">🧩</span>
          <div>
            <p><strong>הדוח עדיין לא שלם.</strong> חסרים החלקים הבאים:</p>
            <div className="report-missing-links">
              {missing.map((m) => (
                <button key={m.label} className="btn btn-ghost btn-small" onClick={() => goTo(m.step)}>
                  ← {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="report-sheet">
        <div className="report-header">
          <span className="report-stamp">סודי ביותר · לעיון המורה בלבד</span>
          <h3>דוח משימה — משבר הטילים בקובה, אוקטובר 1962</h3>
          <p>צוות FDE: הסוכן "{config.name.trim() || '— טרם נקבע —'}"</p>
        </div>

        <div className="report-section">
          <h4>🚧 שלב 1 · האבחון: צוואר הבקבוק המרכזי</h4>
          {bottleneck ? (
            <p className="report-highlight">{bottleneck.icon} {bottleneck.title}</p>
          ) : (
            <p className="report-empty">טרם נבחר צוואר בקבוק מרכזי.</p>
          )}
          {evidence.length > 0 && (
            <>
              <p className="report-label">הראיות שנבחרו ({evidence.length}):</p>
              <ul className="check-list">
                {evidence.map((e) => (
                  <li key={e.id}>{e.icon} {e.label} <em>({e.source})</em></li>
                ))}
              </ul>
            </>
          )}
          {work.bottleneckStatement.trim() && (
            <>
              <p className="report-label">הטיעון שלנו:</p>
              <blockquote className="report-quote">{work.bottleneckStatement}</blockquote>
            </>
          )}
        </div>

        <div className="report-section">
          <h4>🤖 שלב 2 · ארכיטקטורה: תכנון הסוכן</h4>
          <dl className="agent-summary">
            <dt>שם:</dt>
            <dd>{config.name.trim() || '—'}</dd>
            <dt>תפקיד:</dt>
            <dd>{config.role || '—'}</dd>
            <dt>מקורות ידע:</dt>
            <dd>{config.knowledgeSources.length ? config.knowledgeSources.join(' · ') : '—'}</dd>
            <dt>מגבלות בטיחות:</dt>
            <dd>{config.safetyLimits.length ? config.safetyLimits.join(' · ') : '—'}</dd>
            <dt>סוג פלט:</dt>
            <dd>{config.outputType || '—'}</dd>
          </dl>
        </div>

        <div className="report-section">
          <h4>⌨️ שלב 3 · הטמעה: פרומפט המערכת (ציון מחוון: {sim.rubric.total}/{sim.rubric.max})</h4>
          <pre className="report-prompt">{promptText}</pre>
        </div>

        <div className="report-section">
          <h4>📡 שלב 4 · ההרצה: ההחלטה שהומלצה לנשיא</h4>
          {decision ? (
            <>
              <p className="report-highlight">
                {decision.icon} {decision.title} <span className="report-risk">(סיכון: {decision.risk})</span>
              </p>
              <p className="report-label">מה אומרת ההיסטוריה:</p>
              <blockquote className="report-quote">{decision.outcome}</blockquote>
              {sim.debrief.some((d) => d.kind === 'hallucination') && (
                <p className="report-warning">
                  👻 בתחקיר התגלה שהסוכן ייצר הזיה (Hallucination) — פרט בדוי שלא
                  היה באף מקור. ראו מסקנות ברפלקציה.
                </p>
              )}
            </>
          ) : (
            <p className="report-empty">טרם התקבלה החלטה בסימולציה.</p>
          )}
        </div>

        <div className="report-section">
          <h4>🪞 רפלקציה: התובנות שלנו</h4>
          {answeredReflections.length ? (
            answeredReflections.map((q) => (
              <div key={q.id} className="report-reflection">
                <p className="report-label">{q.icon} {q.question}</p>
                <blockquote className="report-quote">{work.reflectionAnswers[q.id]}</blockquote>
              </div>
            ))
          ) : (
            <p className="report-empty">טרם נענו שאלות הרפלקציה.</p>
          )}
        </div>
      </div>

      <div className="report-actions">
        <button className="btn btn-primary" onClick={() => window.print()}>
          🖨️ הדפסת הדוח
        </button>
        <button className="btn btn-ghost" onClick={confirmReset}>
          🗑️ אתחול הפעילות (לתלמיד הבא)
        </button>
      </div>
    </section>
  );
}
