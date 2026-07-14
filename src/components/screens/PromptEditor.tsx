import { useMemo, useState } from 'react';
import { AgentConfig } from '../../types';
import { promptTemplate } from '../../data/content';

interface PromptEditorProps {
  config: AgentConfig;
}

const checklist = [
  { id: 'identity', label: 'זהות ותפקיד ("אתה אנליסט...")', keywords: ['אתה', 'תפקיד'] },
  { id: 'context', label: 'הקשר היסטורי (1962, קובה)', keywords: ['1962', 'קובה'] },
  { id: 'rules', label: 'כללי בטיחות (אל תמציא, ודאות)', keywords: ['אל תמציא', 'ודאות', 'עובדות'] },
  { id: 'format', label: 'פורמט פלט ברור', keywords: ['פורמט', 'נקודות', 'סיכום'] },
];

export default function PromptEditor({ config }: PromptEditorProps) {
  const initial = useMemo(
    () => promptTemplate(config.name.trim() ? `"${config.name.trim()}"` : '', config.role),
    [config.name, config.role],
  );
  const [prompt, setPrompt] = useState(initial);
  const [touched, setTouched] = useState(false);

  const text = touched ? prompt : initial;

  return (
    <section className="screen">
      <h2 className="screen-title">⌨️ כתיבת פרומפט המערכת</h2>
      <p className="screen-lead">
        שלב 3 של FDE — הטמעה. פרומפט המערכת הוא "תעודת הזהות" שהסוכן מקבל לפני
        שהוא רואה אפילו מברק אחד. הכנו לכם תבנית על בסיס ההגדרות שבחרתם —
        אתם מוזמנים לערוך, לשפר ולהוסיף.
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
            onChange={(e) => {
              setTouched(true);
              setPrompt(e.target.value);
            }}
            spellCheck={false}
          />
          {touched && (
            <button
              className="btn btn-ghost btn-small"
              onClick={() => {
                setTouched(false);
                setPrompt(initial);
              }}
            >
              ↺ שחזור התבנית המקורית
            </button>
          )}
        </div>

        <aside className="card prompt-tips">
          <h3>✅ מה חייב להיות בפרומפט טוב?</h3>
          <ul className="prompt-checklist">
            {checklist.map((c) => {
              const present = c.keywords.some((k) => text.includes(k));
              return (
                <li key={c.id} className={present ? 'present' : 'missing'}>
                  <span className="check-mark">{present ? '✓' : '○'}</span>
                  {c.label}
                </li>
              );
            })}
          </ul>
          <div className="callout">
            <span className="callout-icon">💡</span>
            <p>
              טיפ: פרומפט טוב הוא ספציפי. "תהיה מועיל" — חלש. "ציין רמת ודאות
              לכל קביעה" — חזק. נסו להוסיף כלל משלכם!
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
