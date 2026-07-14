import { useState } from 'react';
import { fdeStages } from '../../data/content';

export default function Stages() {
  const [openStage, setOpenStage] = useState(0);
  const stage = fdeStages[openStage];

  return (
    <section className="screen">
      <h2 className="screen-title">🗺️ ארבעת השלבים — מקרוב</h2>
      <p className="screen-lead">לחצו על כל שלב כדי לגלות מה עושים בו ואיך הוא נראה במשבר בקובה.</p>

      <div className="stages-timeline">
        {fdeStages.map((s, i) => (
          <button
            key={s.num}
            className={`stage-node ${i === openStage ? 'active' : ''}`}
            onClick={() => setOpenStage(i)}
          >
            <span className="stage-node-icon">{s.icon}</span>
            <span className="stage-node-num">שלב {s.num}</span>
            <span className="stage-node-title">{s.title}</span>
          </button>
        ))}
      </div>

      <div className="card stage-detail" key={stage.num}>
        <h3>
          {stage.icon} שלב {stage.num}: {stage.title}
        </h3>
        <ul className="check-list">
          {stage.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <div className="stage-example">
          <span className="stage-example-badge">🇨🇺 במשבר בקובה</span>
          <p>{stage.crisisExample}</p>
        </div>
      </div>
    </section>
  );
}
