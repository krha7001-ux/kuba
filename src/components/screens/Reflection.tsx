import { useState } from 'react';
import { reflectionQuestions } from '../../data/content';

export default function Reflection() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const answeredCount = reflectionQuestions.filter(
    (q) => (answers[q.id] ?? '').trim().length > 0,
  ).length;

  return (
    <section className="screen">
      <h2 className="screen-title">🪞 רפלקציה וסיכום</h2>
      <p className="screen-lead">
        רגע לפני שיוצאים מחדר המצב — עצרו וחשבו. כתבו תשובה קצרה (2–3 משפטים)
        לכל שאלה. אין תשובה "נכונה" אחת.
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
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="callout">
        <span className="callout-icon">{answeredCount === reflectionQuestions.length ? '🌟' : '✍️'}</span>
        <p>
          {answeredCount === reflectionQuestions.length
            ? 'עניתם על כל השאלות — כל הכבוד! שתפו את התשובות בדיון כיתתי.'
            : `עניתם על ${answeredCount} מתוך ${reflectionQuestions.length} שאלות. התשובות נשמרות על המסך לצורך דיון בכיתה.`}
        </p>
      </div>
    </section>
  );
}
