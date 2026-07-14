import { useEffect, useState } from 'react';

const zones = [
  { city: 'וושינגטון', tz: 'America/New_York' },
  { city: 'מוסקבה', tz: 'Europe/Moscow' },
  { city: 'הוואנה', tz: 'America/Havana' },
];

function timeIn(tz: string): string {
  return new Intl.DateTimeFormat('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: tz,
  }).format(new Date());
}

/** שעוני קיר של חדר המצב — וושינגטון, מוסקבה, הוואנה */
export default function WorldClocks() {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="world-clocks" aria-label="שעוני חדר המצב">
      {zones.map((z) => (
        <div key={z.tz} className="clock">
          <span className="clock-city">{z.city}</span>
          <span className="clock-time">{timeIn(z.tz)}</span>
        </div>
      ))}
      <div className="clock defcon">
        <span className="clock-city">כוננות</span>
        <span className="defcon-level">
          DEFCON 2
          <i className="defcon-lamp" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
