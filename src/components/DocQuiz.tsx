import { useState } from 'react';
import { docQuestions } from '../data/pedagogy';
import { StudentWork } from '../types';

interface DocQuizProps {
  docId: string;
  work: StudentWork;
  update: (patch: Partial<StudentWork>) => void;
}

/** שלוש שאלות חקר על מסמך: מידע מרכזי, אמינות, השפעה על ההחלטה */
export default function DocQuiz({ docId, work, update }: DocQuizProps) {
  const questions = docQuestions[docId];
  const [open, setOpen] = useState(false);
  if (!questions) return null;

  const answers = work.docAnswers[docId] ?? {};
  const answeredCount = questions.filter((q) => answers[q.id]).length;

  const answer = (questionId: string, optionId: string) => {
    update({
      docAnswers: {
        ...work.docAnswers,
        [docId]: { ...answers, [questionId]: optionId },
      },
    });
  };

  return (
    <div className="doc-quiz">
      <button className="doc-quiz-toggle" onClick={() => setOpen(!open)}>
        🕵️ ניתוח המסמך ({answeredCount}/{questions.length}) {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="doc-quiz-body">
          {questions.map((q) => {
            const chosen = answers[q.id];
            const chosenOption = q.options.find((o) => o.id === chosen);
            return (
              <div key={q.id} className="doc-question">
                <p className="doc-question-text">{q.question}</p>
                <div className="doc-question-options">
                  {q.options.map((o) => (
                    <button
                      key={o.id}
                      className={`doc-option ${
                        chosen === o.id ? (o.good ? 'good' : 'partial') : ''
                      }`}
                      onClick={() => answer(q.id, o.id)}
                    >
                      {o.text}
                    </button>
                  ))}
                </div>
                {chosenOption && (
                  <p className={`doc-feedback ${chosenOption.good ? 'good' : 'partial'}`}>
                    {chosenOption.good ? '✓' : '💭'} {chosenOption.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
