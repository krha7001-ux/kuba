import { useState } from 'react';
import {
  telegrams,
  satellitePhotos,
  kennedy,
  khrushchev,
  excommInfo,
  DossierPerson,
} from '../../data/content';
import { StudentWork } from '../../types';
import SourceBadge from '../SourceBadge';
import DocQuiz from '../DocQuiz';

const tabs = [
  { id: 'telegrams', label: 'מברקים סודיים', icon: '📜' },
  { id: 'photos', label: 'תצלומי לוויין', icon: '🛰️' },
  { id: 'kennedy', label: 'קנדי', icon: '🇺🇸' },
  { id: 'khrushchev', label: 'חרושצ׳וב', icon: '🇷🇺' },
  { id: 'excomm', label: 'EXCOMM', icon: '🏛️' },
] as const;

type TabId = (typeof tabs)[number]['id'];

interface DossierProps {
  work: StudentWork;
  update: (patch: Partial<StudentWork>) => void;
}

function PersonCard({
  person,
  docId,
  work,
  update,
}: {
  person: DossierPerson;
  docId: string;
} & DossierProps) {
  return (
    <div className="card person-card">
      <div className="person-header">
        <span className="person-icon">{person.icon}</span>
        <div>
          <h3>{person.name}</h3>
          <p className="person-title">{person.title}</p>
        </div>
      </div>
      <SourceBadge docId={docId} />
      <ul className="check-list">
        {person.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <blockquote className="person-quote">{person.quote}</blockquote>
      <DocQuiz docId={docId} work={work} update={update} />
    </div>
  );
}

export default function Dossier({ work, update }: DossierProps) {
  const [tab, setTab] = useState<TabId>('telegrams');

  return (
    <section className="screen">
      <h2 className="screen-title">🗂️ תיק לקוח: הבית הלבן, אוקטובר 1962</h2>
      <p className="screen-lead">
        שלב 1 של FDE — כניסה לשטח. לפניכם חומרי המודיעין שהיו על שולחן קנדי.
        לכל מסמך מוצמדת <strong>תווית מקור</strong> (לחצו עליה להסבר), ולכל מסמך
        מצורף <strong>ניתוח מסמך</strong> — שלוש שאלות של אנליסט אמיתי. ענו עליהן:
        הן יעזרו לכם בלוח הראיות שבמסך הבא.
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
              <SourceBadge docId={tg.id} />
              <DocQuiz docId={tg.id} work={work} update={update} />
            </article>
          ))}
        </div>
      )}

      {tab === 'photos' && (
        <>
          <SourceBadge docId="photos" />
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
          <DocQuiz docId="photos" work={work} update={update} />
        </>
      )}

      {tab === 'kennedy' && (
        <PersonCard person={kennedy} docId="kennedy" work={work} update={update} />
      )}
      {tab === 'khrushchev' && (
        <PersonCard person={khrushchev} docId="khrushchev" work={work} update={update} />
      )}

      {tab === 'excomm' && (
        <div className="card person-card">
          <div className="person-header">
            <span className="person-icon">{excommInfo.icon}</span>
            <div>
              <h3>{excommInfo.title}</h3>
              <p className="person-title">{excommInfo.subtitle}</p>
            </div>
          </div>
          <SourceBadge docId="excomm" />
          <ul className="check-list">
            {excommInfo.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <DocQuiz docId="excomm" work={work} update={update} />
        </div>
      )}
    </section>
  );
}
