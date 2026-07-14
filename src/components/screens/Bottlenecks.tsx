import { useState } from 'react';
import { bottleneckOptions } from '../../data/content';
import { evidenceItems } from '../../data/pedagogy';
import { StudentWork } from '../../types';

interface BottlenecksProps {
  work: StudentWork;
  update: (patch: Partial<StudentWork>) => void;
}

export default function Bottlenecks({ work, update }: BottlenecksProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);

  const toggle = (id: string) => {
    if (checked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const correctCount = bottleneckOptions.filter(
    (b) => b.isBottleneck === selected.has(b.id),
  ).length;

  const toggleEvidence = (id: string) => {
    const next = work.evidenceIds.includes(id)
      ? work.evidenceIds.filter((e) => e !== id)
      : [...work.evidenceIds, id];
    update({ evidenceIds: next });
  };

  const realBottlenecks = bottleneckOptions.filter((b) => b.isBottleneck);
  const chosenBottleneck = realBottlenecks.find((b) => b.id === work.mainBottleneckId);
  const supportingCount = work.evidenceIds.filter(
    (id) => evidenceItems.find((e) => e.id === id)?.supports === work.mainBottleneckId,
  ).length;

  const boardComplete =
    work.evidenceIds.length >= 2 &&
    work.mainBottleneckId !== '' &&
    work.bottleneckStatement.trim().length >= 20;

  return (
    <section className="screen">
      <h2 className="screen-title">🚧 זיהוי צווארי בקבוק</h2>
      <p className="screen-lead">
        צוואר בקבוק הוא נקודה שבה זרימת המידע או ההחלטות <strong>נתקעת</strong> —
        וכל המערכת מחכה. סמנו אילו מהמצבים הבאים היו צווארי בקבוק אמיתיים במשבר,
        ואז לחצו "בדיקה".
      </p>

      <div className="bottleneck-grid">
        {bottleneckOptions.map((b) => {
          const isSelected = selected.has(b.id);
          const correct = checked && b.isBottleneck === isSelected;
          return (
            <button
              key={b.id}
              className={`card bottleneck-card ${isSelected ? 'selected' : ''} ${
                checked ? (correct ? 'correct' : 'wrong') : ''
              }`}
              onClick={() => toggle(b.id)}
              disabled={checked}
            >
              <div className="bottleneck-top">
                <span className="card-icon">{b.icon}</span>
                {checked && <span className="result-mark">{correct ? '✓' : '✗'}</span>}
              </div>
              <h4>{b.title}</h4>
              <p>{b.description}</p>
              {checked && <p className="bottleneck-explanation">{b.explanation}</p>}
            </button>
          );
        })}
      </div>

      {!checked ? (
        <button
          className="btn btn-primary btn-large"
          onClick={() => setChecked(true)}
          disabled={selected.size === 0}
        >
          🔎 בדיקה
        </button>
      ) : (
        <div className="callout result-callout">
          <span className="callout-icon">{correctCount === bottleneckOptions.length ? '🏅' : '💪'}</span>
          <p>
            זיהיתם נכון {correctCount} מתוך {bottleneckOptions.length} פריטים.{' '}
            {correctCount === bottleneckOptions.length
              ? 'מושלם! אתם חושבים כמו מהנדסי FDE אמיתיים.'
              : 'קראו את ההסברים בכרטיסים — ושימו לב: צוואר בקבוק הוא תמיד מקום שבו המידע עצמו נתקע.'}
          </p>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setChecked(false);
              setSelected(new Set());
            }}
          >
            🔄 ניסיון נוסף
          </button>
        </div>
      )}

      {/* ===== לוח ראיות ===== */}
      <div className="evidence-board">
        <h3 className="section-title">📌 לוח ראיות: מהו צוואר הבקבוק המרכזי?</h3>
        <p className="screen-lead">
          אנליסט לא מסתפק ב"נכון/לא נכון" — הוא בונה טיעון. בחרו{' '}
          <strong>לפחות שתי ראיות</strong> מהתיק, קבעו מהו צוואר הבקבוק{' '}
          <strong>המרכזי</strong> לדעתכם, ונסחו את הטיעון שלכם. המסקנה תופיע
          בדוח המשימה הסופי.
        </p>

        <h4 className="evidence-subtitle">1️⃣ בחרו ראיות מהתיק ({work.evidenceIds.length} נבחרו)</h4>
        <div className="evidence-grid">
          {evidenceItems.map((ev) => (
            <button
              key={ev.id}
              className={`card evidence-card ${work.evidenceIds.includes(ev.id) ? 'pinned' : ''}`}
              onClick={() => toggleEvidence(ev.id)}
            >
              <span className="evidence-pin">{work.evidenceIds.includes(ev.id) ? '📌' : '○'}</span>
              <span className="evidence-icon">{ev.icon}</span>
              <p>{ev.label}</p>
              <span className="evidence-source">מקור: {ev.source}</span>
            </button>
          ))}
        </div>

        <h4 className="evidence-subtitle">2️⃣ מהו צוואר הבקבוק המרכזי לדעתכם?</h4>
        <div className="evidence-bottleneck-row">
          {realBottlenecks.map((b) => (
            <button
              key={b.id}
              className={`evidence-bottleneck-choice ${work.mainBottleneckId === b.id ? 'chosen' : ''}`}
              onClick={() => update({ mainBottleneckId: b.id })}
            >
              {b.icon} {b.title}
            </button>
          ))}
        </div>

        <h4 className="evidence-subtitle">3️⃣ נסחו את הטיעון (לפחות שני משפטים)</h4>
        <textarea
          className="reflection-textarea"
          rows={3}
          placeholder='למשל: "צוואר הבקבוק המרכזי הוא ___, כי הראיות מראות ש___. לכן הסוכן שנבנה צריך ___."'
          value={work.bottleneckStatement}
          onChange={(e) => update({ bottleneckStatement: e.target.value })}
        />

        {work.mainBottleneckId && work.evidenceIds.length >= 2 && (
          <div className="callout">
            <span className="callout-icon">{supportingCount >= 1 ? '🧩' : '🤔'}</span>
            <p>
              {supportingCount >= 1
                ? `${supportingCount} מתוך ${work.evidenceIds.length} הראיות שבחרתם תומכות ישירות ב"${chosenBottleneck?.title}" — טיעון מבוסס. ראיות שתומכות בצוואר בקבוק אחר יכולות לשמש אתכם כטיעון־נגד.`
                : `שימו לב: אף אחת מהראיות שבחרתם לא תומכת ישירות ב"${chosenBottleneck?.title}". זה לא בהכרח פסול — אבל בדקו: אולי הראיות מצביעות על צוואר בקבוק אחר, או שכדאי לבחור ראיות אחרות.`}
            </p>
          </div>
        )}

        <div className={`callout ${boardComplete ? 'board-done' : ''}`}>
          <span className="callout-icon">{boardComplete ? '✅' : '🗂️'}</span>
          <p>
            {boardComplete
              ? 'לוח הראיות הושלם! המסקנה שלכם תלווה אתכם עד דוח המשימה. עכשיו — לתכנון הסוכן.'
              : `כדי להשלים את הלוח: ${[
                  work.evidenceIds.length < 2 ? 'בחרו לפחות 2 ראיות' : '',
                  !work.mainBottleneckId ? 'בחרו צוואר בקבוק מרכזי' : '',
                  work.bottleneckStatement.trim().length < 20 ? 'נסחו טיעון מלא' : '',
                ]
                  .filter(Boolean)
                  .join(' · ')}`}
          </p>
        </div>
      </div>
    </section>
  );
}
