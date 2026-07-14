import { useState } from 'react';
import {
  telegrams,
  satellitePhotos,
  kennedy,
  khrushchev,
  excommInfo,
  DossierPerson,
} from '../../data/content';

const tabs = [
  { id: 'telegrams', label: 'מברקים סודיים', icon: '📜' },
  { id: 'photos', label: 'תצלומי לוויין', icon: '🛰️' },
  { id: 'kennedy', label: 'קנדי', icon: '🇺🇸' },
  { id: 'khrushchev', label: 'חרושצ׳וב', icon: '🇷🇺' },
  { id: 'excomm', label: 'EXCOMM', icon: '🏛️' },
] as const;

type TabId = (typeof tabs)[number]['id'];

function PersonCard({ person }: { person: DossierPerson }) {
  return (
    <div className="card person-card">
      <div className="person-header">
        <span className="person-icon">{person.icon}</span>
        <div>
          <h3>{person.name}</h3>
          <p className="person-title">{person.title}</p>
        </div>
      </div>
      <ul className="check-list">
        {person.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <blockquote className="person-quote">{person.quote}</blockquote>
    </div>
  );
}

export default function Dossier() {
  const [tab, setTab] = useState<TabId>('telegrams');

  return (
    <section className="screen">
      <h2 className="screen-title">🗂️ תיק לקוח: הבית הלבן, אוקטובר 1962</h2>
      <p className="screen-lead">
        שלב 1 של FDE — כניסה לשטח. לפניכם חומרי המודיעין שהיו על שולחן קנדי.
        עברו על הכרטיסיות והכירו את "הלקוח" שלכם.
      </p>

      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'telegrams' && (
        <div className="telegram-list">
          {telegrams.map((tg) => (
            <article key={tg.id} className="telegram">
              <div className="telegram-header">
                <span className="telegram-stamp">{tg.classification}</span>
                <span className="telegram-id">{tg.id}</span>
              </div>
              <div className="telegram-meta">
                <span><strong>מאת:</strong> {tg.from}</span>
                <span><strong>אל:</strong> {tg.to}</span>
                <span><strong>תאריך:</strong> {tg.date}</span>
              </div>
              <p className="telegram-body">{tg.body}</p>
            </article>
          ))}
        </div>
      )}

      {tab === 'photos' && (
        <div className="photo-grid">
          {satellitePhotos.map((p) => (
            <div key={p.id} className="card photo-card">
              <div className="photo-frame">
                <span className="photo-crosshair">✛</span>
                <span className="photo-id">{p.id}</span>
              </div>
              <h4>📍 {p.location}</h4>
              <p className="photo-date">צולם: {p.date}</p>
              <p>{p.finding}</p>
              <span className={`confidence-badge ${p.confidence === 'ודאות גבוהה' ? 'high' : p.confidence === 'ודאות בינונית' ? 'mid' : 'low'}`}>
                {p.confidence}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'kennedy' && <PersonCard person={kennedy} />}
      {tab === 'khrushchev' && <PersonCard person={khrushchev} />}

      {tab === 'excomm' && (
        <div className="card person-card">
          <div className="person-header">
            <span className="person-icon">{excommInfo.icon}</span>
            <div>
              <h3>{excommInfo.title}</h3>
              <p className="person-title">{excommInfo.subtitle}</p>
            </div>
          </div>
          <ul className="check-list">
            {excommInfo.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
