import { fdeStages } from '../../data/content';

export default function FdeIntro() {
  return (
    <section className="screen">
      <h2 className="screen-title">💡 מהי מתודת FDE?</h2>
      <p className="screen-lead">
        FDE — <strong>Forward Deployed Engineering</strong> — היא שיטת עבודה של
        מהנדסי טכנולוגיה שלא יושבים במשרד ומחכים, אלא <strong>נשלחים קדימה, אל השטח</strong>:
        אל הלקוח, אל הבעיה האמיתית, אל הבלגן. שם הם לומדים את הבעיה מבפנים,
        בונים פתרון מותאם — ובודקים אותו במציאות.
      </p>

      <div className="callout">
        <span className="callout-icon">🎖️</span>
        <p>
          אצלנו "הלקוח" הוא הבית הלבן של 1962, "השטח" הוא חדר המצב של משבר הטילים,
          ו"הפתרון" הוא סוכן AI שנתכנן בעצמנו. מוכנים?
        </p>
      </div>

      <h3 className="section-title">ארבעת שלבי המודל</h3>
      <div className="fde-mini-grid">
        {fdeStages.map((s) => (
          <div key={s.num} className="card fde-mini-card">
            <div className="fde-mini-num">{s.num}</div>
            <div className="fde-mini-icon">{s.icon}</div>
            <h4>{s.title}</h4>
            <p>{s.short}</p>
          </div>
        ))}
      </div>

      <p className="screen-note">
        במסך הבא נצלול לכל שלב לעומק — ונראה איך הוא מתחבר למשבר בקובה.
      </p>
    </section>
  );
}
