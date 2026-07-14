import { StudentWork } from '../../types';
import { promptTemplate } from '../../data/content';
import { evaluatePrompt } from '../../data/promptRubric';

interface PromptEditorProps {
  work: StudentWork;
  update: (patch: Partial<StudentWork>) => void;
}

export default function PromptEditor({ work, update }: PromptEditorProps) {
  const config = work.agentConfig;
  const initial = promptTemplate(
    config.name.trim() ? `"${config.name.trim()}"` : '',
    config.role,
  );
  const text = work.promptText ?? initial;
  const result = evaluatePrompt(text, config);

  return (
    <section className="screen">
      <h2 className="screen-title">⌨️ כתיבת פרומפט המערכת</h2>
      <p className="screen-lead">
        שלב 3 של FDE — הטמעה. פרומפט המערכת הוא "תעודת הזהות" שהסוכן מקבל לפני
        שהוא רואה אפילו מברק אחד. הכנו תבנית על בסיס ההגדרות שבחרתם — ערכו
        ושפרו אותה, ועקבו אחרי <strong>מחוון האיכות</strong>: הציון ישפיע ישירות
        על חדות הניתוח בסימולציה.
      </p>

      <div className="prompt-layout">
        <div className="card prompt-card">
          <div className="prompt-card-header">
            <span className="terminal-dots"><i /><i /><i /></span>
            <span>system_prompt.txt</span>
          </div>
          <textarea
            className="prompt-textarea"
            value={text}
            rows={18}
            onChange={(e) => update({ promptText: e.target.value })}
            spellCheck={false}
          />
          {work.promptText !== null && (
            <button
              className="btn btn-ghost btn-small"
              onClick={() => update({ promptText: null })}
            >
              ↺ שחזור התבנית המקורית
            </button>
          )}
        </div>

        <aside className="card prompt-tips">
          <h3>📏 מחוון איכות הפרומפט</h3>
          <div className={`rubric-total band-${result.band}`}>
            <div className="rubric-total-score">
              {result.total}<span>/{result.max}</span>
            </div>
            <p>{result.bandLabel}</p>
          </div>

          <ul className="rubric-list">
            {result.perCriterion.map(({ criterion, score }) => (
              <li key={criterion.id} className={`rubric-item score-${score}`}>
                <div className="rubric-item-head">
                  <span className="rubric-item-title">
                    {criterion.icon} {criterion.title}
                  </span>
                  <span className="rubric-dots" aria-label={`${score} מתוך 2`}>
                    <i className={score >= 1 ? 'on' : ''} />
                    <i className={score >= 2 ? 'on' : ''} />
                  </span>
                </div>
                <p className="rubric-level">{criterion.levels[score]}</p>
                {score < 2 && <p className="rubric-tip">💡 {criterion.tip}</p>}
              </li>
            ))}
          </ul>

          <p className="rubric-disclaimer">
            המחוון הוא הערכה אוטומטית ראשונית של מבנה הפרומפט — הוא לא מבין את
            התוכן לעומק. השוו את הפרומפט שלכם גם עם חברים ועם המורה.
          </p>
        </aside>
      </div>
    </section>
  );
}
