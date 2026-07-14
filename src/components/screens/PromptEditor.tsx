import { StudentWork } from '../../types';
import { knowledgeOptions } from '../../data/content';
import {
  PromptSections,
  initialPromptSections,
  ruleOptions,
  formatPresets,
  assemblePrompt,
  evaluateSections,
} from '../../data/promptBuilder';

interface PromptEditorProps {
  work: StudentWork;
  update: (patch: Partial<StudentWork>) => void;
}

export default function PromptEditor({ work, update }: PromptEditorProps) {
  const sections = work.promptSections;
  const set = (patch: Partial<PromptSections>) =>
    update({ promptSections: { ...sections, ...patch } });

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const result = evaluateSections(sections);
  const preview = assemblePrompt(sections);
  const byId = Object.fromEntries(result.perSection.map((r) => [r.id, r]));

  const StatusPill = ({ id }: { id: string }) => (
    <span className={`builder-status score-${byId[id].score}`}>
      {byId[id].score === 2 ? '●' : byId[id].score === 1 ? '◐' : '○'} {byId[id].label}
    </span>
  );

  const Advice = ({ id }: { id: string }) => (
    <p className={`builder-advice score-${byId[id].score}`}>
      {byId[id].score === 2 ? '✓' : '💡'} {byId[id].advice}
    </p>
  );

  return (
    <section className="screen">
      <h2 className="screen-title">⌨️ סדנת הפרומפט: בונים את הסוכן מילה במילה</h2>
      <p className="screen-lead">
        שלב 3 של FDE — הטמעה. קיבלתם <strong>טיוטה חלשה בכוונה</strong> — ציון
        הפתיחה שלה נמוך. שדרגו כל אחד מששת הרכיבים: כתבו, בחרו וערכו. התצוגה
        המקדימה מתעדכנת בזמן אמת, וכל רכיב מקבל משוב. אפשר להמשיך לסימולציה גם
        עם פרומפט חלקי — ואז לחזור, לשפר ולהריץ שוב כדי להשוות.
      </p>

      <div className="builder-layout">
        <div className="builder-sections">
          {/* 1. זהות ותפקיד */}
          <div className="card builder-card builder-identity">
            <div className="builder-head">
              <h3>🎭 1 · זהות ותפקיד הסוכן</h3>
              <StatusPill id="identity" />
            </div>
            <textarea
              className="builder-textarea"
              rows={2}
              value={sections.identity}
              onChange={(e) => set({ identity: e.target.value })}
              placeholder='למשל: אתה "עין הנץ", אנליסט מודיעין בכיר ב־CIA...'
            />
            <Advice id="identity" />
          </div>

          {/* 2. הקשר היסטורי */}
          <div className="card builder-card builder-context">
            <div className="builder-head">
              <h3>🌍 2 · ההקשר ההיסטורי</h3>
              <StatusPill id="context" />
            </div>
            <textarea
              className="builder-textarea"
              rows={2}
              value={sections.context}
              onChange={(e) => set({ context: e.target.value })}
              placeholder="מתי? איפה? מה קורה? מי מול מי?"
            />
            <Advice id="context" />
          </div>

          {/* 3. המשימה */}
          <div className="card builder-card builder-mission">
            <div className="builder-head">
              <h3>🎯 3 · המשימה שעל הסוכן לבצע</h3>
              <StatusPill id="mission" />
            </div>
            <textarea
              className="builder-textarea"
              rows={2}
              value={sections.mission}
              onChange={(e) => set({ mission: e.target.value })}
              placeholder="פועל + חומר + נמען. למשל: נתח כל מברק נכנס והגש לנשיא תמונת מצב."
            />
            <Advice id="mission" />
          </div>

          {/* 4. מקורות מותרים */}
          <div className="card builder-card builder-sources">
            <div className="builder-head">
              <h3>📚 4 · המקורות המותרים (לפחות שניים)</h3>
              <StatusPill id="sources" />
            </div>
            {knowledgeOptions.map((k) => (
              <label key={k} className="option-row">
                <input
                  type="checkbox"
                  checked={sections.sources.includes(k)}
                  onChange={() => set({ sources: toggleInList(sections.sources, k) })}
                />
                <span>{k}</span>
              </label>
            ))}
            <Advice id="sources" />
          </div>

          {/* 5. אמינות ובטיחות */}
          <div className="card builder-card builder-rules">
            <div className="builder-head">
              <h3>🛡️ 5 · כללי אמינות ומגבלות בטיחות</h3>
              <StatusPill id="rules" />
            </div>
            {ruleOptions.map((r) => (
              <label key={r.id} className="option-row">
                <input
                  type="checkbox"
                  checked={sections.rules.includes(r.id)}
                  onChange={() => set({ rules: toggleInList(sections.rules, r.id) })}
                />
                <span>{r.text}</span>
              </label>
            ))}
            <input
              type="text"
              className="text-input builder-extra-rule"
              placeholder="כלל נוסף משלכם (לא חובה)..."
              value={sections.rulesExtra}
              onChange={(e) => set({ rulesExtra: e.target.value })}
            />
            <Advice id="rules" />
          </div>

          {/* 6. פורמט */}
          <div className="card builder-card builder-format">
            <div className="builder-head">
              <h3>📤 6 · פורמט התשובה</h3>
              <StatusPill id="format" />
            </div>
            <div className="format-presets">
              {formatPresets.map((p) => (
                <button
                  key={p.id}
                  className={`format-preset ${sections.format === p.text ? 'active' : ''}`}
                  onClick={() => set({ format: p.text })}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <textarea
              className="builder-textarea"
              rows={2}
              value={sections.format}
              onChange={(e) => set({ format: e.target.value })}
              placeholder="אילו חלקים, באיזה סדר, באיזה אורך?"
            />
            <Advice id="format" />
          </div>
        </div>

        <aside className="builder-side">
          <div className={`rubric-total band-${result.band}`}>
            <div className="rubric-total-score">
              {result.total}<span>/{result.max}</span>
            </div>
            <p>{result.bandLabel}</p>
          </div>

          <div className="card prompt-card">
            <div className="prompt-card-header">
              <span className="terminal-dots"><i /><i /><i /></span>
              <span>system_prompt.txt · תצוגה חיה</span>
            </div>
            <pre className="prompt-preview" dir="rtl">{preview || '— הפרומפט ריק —'}</pre>
          </div>

          <button
            className="btn btn-ghost btn-small"
            onClick={() => update({ promptSections: initialPromptSections })}
          >
            ↺ חזרה לטיוטה ההתחלתית
          </button>

          <div className="callout">
            <span className="callout-icon">🧪</span>
            <p>
              לא חייבים ציון מושלם כדי להתקדם! מותר להריץ את הסימולציה גם עם
              פרומפט חלקי — תראו סוכן חלש בפעולה, תחזרו לכאן, תשפרו, ותריצו שוב.
              ההשוואה היא הלמידה.
            </p>
          </div>

          <p className="rubric-disclaimer">
            המחוון הוא הערכה אוטומטית של מבנה ותוכן הרכיבים — הוא לא קורא מחשבות.
            השוו את הפרומפט גם עם חברים ועם המורה.
          </p>
        </aside>
      </div>
    </section>
  );
}
