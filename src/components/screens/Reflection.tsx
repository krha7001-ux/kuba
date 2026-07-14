import { reflectionQuestions } from '../../data/content';
import { StudentWork } from '../../types';

interface ReflectionProps {
  work: StudentWork;
  update: (patch: Partial<StudentWork>) => void;
}

export default function Reflection({ work, update }: ReflectionProps) {
  const answers = work.reflectionAnswers;

  const answeredCount = reflectionQuestions.filter(
    (q) => (answers[q.id] ?? '').trim().length > 0,
  ).length;

  return (
    <section className="screen">
      <h2 className="screen-title">🪞 רפלקציה וסיכום</h2>
      <p className="screen-lead">
        רגע לפני שיוצאים מחדר המצב — עצרו וחשבו. כתבו תשובה קצרה (2–3 משפטים)
        לכל שאלה. אין תשובה "נכונה" אחת, והתשובות ייכנסו לדוח המשימה שלכם.
      </p>

      <div className="reflection-grid">
        {reflectionQuestions.map((q) => (
          <div key={q.id} className="card reflection-card">
            <h3>
              {q.icon} {q.question}
            </h3>
            <p className="reflection-hint">{q.hint}</p>
            <textarea
              className="reflection-textarea"
              rows={4}
              placeholder="כתבו כאן את המחשבות שלכם..."
              value={answers[q.id] ?? ''}
              onChange={(e) =>
                update({ reflectionAnswers: { ...answers, [q.id]: e.target.value } })
              }
            />
          </div>
        ))}
      </div>

      <div className="callout">
        <span className="callout-icon">{answeredCount === reflectionQuestions.length ? '🌟' : '✍️'}</span>
        <p>
          {answeredCount === reflectionQuestions.length
            ? 'עניתם על כל השאלות — כל הכבוד! התשובות נשמרו וייכללו בדוח המשימה.'
            : `עניתם על ${answeredCount} מתוך ${reflectionQuestions.length} שאלות. התשובות נשמרות אוטומטית — גם אם תרעננו את הדף.`}
        </p>
      </div>
    </section>
  );
}
