import { AgentConfig } from '../../types';
import {
  roleOptions,
  knowledgeOptions,
  safetyOptions,
  outputOptions,
} from '../../data/content';

interface AgentDesignerProps {
  config: AgentConfig;
  onChange: (c: AgentConfig) => void;
}

export default function AgentDesigner({ config, onChange }: AgentDesignerProps) {
  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const complete =
    config.name.trim() !== '' &&
    config.role !== '' &&
    config.knowledgeSources.length > 0 &&
    config.safetyLimits.length > 0 &&
    config.outputType !== '';

  return (
    <section className="screen">
      <h2 className="screen-title">🤖 תכנון סוכן ה־AI שלכם</h2>
      <p className="screen-lead">
        שלב 2 של FDE — ארכיטקטורת הפתרון. הגדירו את הסוכן שיסייע לחדר המצב.
        ההגדרות שתבחרו כאן ילוו אתכם גם במסכי הפרומפט והסימולציה.
      </p>

      <div className="form-grid">
        <div className="card form-card">
          <h3>🏷️ שם הסוכן</h3>
          <input
            type="text"
            className="text-input"
            placeholder='למשל: "אנליסט צל" או "עין הנץ"'
            value={config.name}
            onChange={(e) => onChange({ ...config, name: e.target.value })}
          />
        </div>

        <div className="card form-card">
          <h3>🎭 תפקיד הסוכן</h3>
          {roleOptions.map((r) => (
            <label key={r} className="option-row">
              <input
                type="radio"
                name="role"
                checked={config.role === r}
                onChange={() => onChange({ ...config, role: r })}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>

        <div className="card form-card">
          <h3>📚 מקורות הידע (בחרו כמה שרלוונטי)</h3>
          {knowledgeOptions.map((k) => (
            <label key={k} className="option-row">
              <input
                type="checkbox"
                checked={config.knowledgeSources.includes(k)}
                onChange={() =>
                  onChange({
                    ...config,
                    knowledgeSources: toggleInList(config.knowledgeSources, k),
                  })
                }
              />
              <span>{k}</span>
            </label>
          ))}
        </div>

        <div className="card form-card">
          <h3>🛡️ מגבלות בטיחות</h3>
          {safetyOptions.map((s) => (
            <label key={s} className="option-row">
              <input
                type="checkbox"
                checked={config.safetyLimits.includes(s)}
                onChange={() =>
                  onChange({
                    ...config,
                    safetyLimits: toggleInList(config.safetyLimits, s),
                  })
                }
              />
              <span>{s}</span>
            </label>
          ))}
        </div>

        <div className="card form-card">
          <h3>📤 סוג הפלט הרצוי</h3>
          {outputOptions.map((o) => (
            <label key={o} className="option-row">
              <input
                type="radio"
                name="output"
                checked={config.outputType === o}
                onChange={() => onChange({ ...config, outputType: o })}
              />
              <span>{o}</span>
            </label>
          ))}
        </div>

        <div className={`card form-card summary-card ${complete ? 'ready' : ''}`}>
          <h3>{complete ? '✅ תעודת זהות של הסוכן' : '📋 תעודת זהות של הסוכן (בבנייה...)'}</h3>
          <dl className="agent-summary">
            <dt>שם:</dt>
            <dd>{config.name || '—'}</dd>
            <dt>תפקיד:</dt>
            <dd>{config.role || '—'}</dd>
            <dt>מקורות ידע:</dt>
            <dd>{config.knowledgeSources.length ? config.knowledgeSources.join(' · ') : '—'}</dd>
            <dt>מגבלות בטיחות:</dt>
            <dd>{config.safetyLimits.length ? `${config.safetyLimits.length} מגבלות נבחרו` : '—'}</dd>
            <dt>פלט:</dt>
            <dd>{config.outputType || '—'}</dd>
          </dl>
          {complete && (
            <p className="summary-ready-note">
              מעולה! הסוכן מוגדר. עכשיו נהפוך את ההגדרה לפרומפט מערכת אמיתי ←
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
