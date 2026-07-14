interface OpeningProps {
  onStart: () => void;
}

export default function Opening({ onStart }: OpeningProps) {
  return (
    <section className="screen opening">
      <div className="opening-stamp">מסמך מסווג · 16.10.1962</div>
      <h2 className="opening-title">
        13 ימים על סף מלחמה גרעינית
      </h2>
      <p className="opening-lead">
        אוקטובר 1962. מטוס ריגול אמריקאי מצלם בקובה משהו שמקפיא את הדם בוושינגטון:
        ברית המועצות מציבה טילים גרעיניים במרחק 150 ק"מ בלבד מחופי ארצות הברית.
        הנשיא קנדי ויועציו חייבים להחליט — ומהר. כל טעות עלולה להצית מלחמת עולם שלישית.
      </p>

      <div className="opening-cards">
        <div className="card mission-card">
          <div className="card-icon">🎯</div>
          <h3>המשימה שלכם</h3>
          <p>
            אתם מצטרפים לחדר המצב כצוות טכנולוגי מיוחד. תיכנסו לתוך האירוע,
            תזהו איפה המידע וההחלטות נתקעים (צווארי בקבוק), ותתכננו{' '}
            <strong>סוכן AI</strong> שהיה יכול לעזור לקנדי ולצוותו להבין את המשבר —
            ואולי אפילו לפתור אותו מהר יותר.
          </p>
        </div>
        <div className="card mission-card">
          <div className="card-icon">🧭</div>
          <h3>איך נעבוד?</h3>
          <p>
            נשתמש ב<strong>מתודת FDE</strong> — שיטת עבודה של מהנדסים שנשלחים
            "לשטח" של לקוח כדי לפתור בעיה אמיתית: מאבחנים, מתכננים, בונים ובודקים.
            בדיוק כמו שנעשה עכשיו עם המשבר של 1962.
          </p>
        </div>
      </div>

      <button className="btn btn-primary btn-large" onClick={onStart}>
        🚨 כניסה לחדר המצב
      </button>
    </section>
  );
}
