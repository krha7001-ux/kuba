import { comparisonRows } from '../../data/content';

export default function Comparison() {
  return (
    <section className="screen">
      <h2 className="screen-title">🏆 מה הרווחנו? למידה מסורתית מול FDE</h2>
      <p className="screen-lead">
        למדנו את אותו אירוע היסטורי — אבל בדרך אחרת לגמרי. הנה ההבדל:
      </p>

      <div className="comparison-header">
        <div className="comparison-col-title traditional">
          <span>📖</span>
          <h3>למידה מסורתית</h3>
          <p>קוראים, משננים, נבחנים</p>
        </div>
        <div className="comparison-vs">מול</div>
        <div className="comparison-col-title fde">
          <span>🚀</span>
          <h3>למידה בגישת FDE</h3>
          <p>נכנסים לשטח, בונים, בודקים</p>
        </div>
      </div>

      <div className="comparison-rows">
        {comparisonRows.map((row) => (
          <div key={row.aspect} className="comparison-row">
            <div className="comparison-aspect">
              <span>{row.icon}</span>
              {row.aspect}
            </div>
            <div className="comparison-cells">
              <div className="card comparison-cell traditional">{row.traditional}</div>
              <div className="card comparison-cell fde">{row.fde}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="callout final-callout">
        <span className="callout-icon">🎓</span>
        <p>
          <strong>המסר לדרך:</strong> ב־1962 העולם ניצל בזכות אנשים שידעו לעצור,
          לנתח מידע בזהירות ולחשוב על חלופות. היום, כשאתם מתכננים סוכני AI,
          אתם לומדים בדיוק את אותה מיומנות — לשאול מה המקורות, מה המגבלות,
          ואיפה גם המכונה עלולה לטעות.
        </p>
      </div>
    </section>
  );
}
