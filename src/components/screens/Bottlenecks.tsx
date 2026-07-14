import { useState } from 'react';
import { bottleneckOptions } from '../../data/content';

export default function Bottlenecks() {
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
    </section>
  );
}
