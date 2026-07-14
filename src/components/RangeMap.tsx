/**
 * לוח מפות סכמטי בסגנון חדר מצב 1962: טווחי הטילים מקובה.
 * איור SVG מופשט (לא מפה מדויקת) — בהשראת מפות התדריך המפורסמות של המשבר.
 */
export default function RangeMap() {
  return (
    <figure className="range-map">
      <div className="range-map-plate">לוח מפות · טווחי הטילים הסובייטיים מקובה</div>
      <svg
        viewBox="0 0 800 430"
        role="img"
        aria-label="מפה סכמטית: טווח טילי MRBM כ־2,000 קילומטר מגיע לוושינגטון, וטווח IRBM כ־4,500 קילומטר מכסה את רוב ארצות הברית"
      >
        {/* רשת קואורדינטות */}
        <g stroke="#3a4438" strokeWidth="0.6" opacity="0.5">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`v${i}`} x1={i * 80 + 40} y1="0" x2={i * 80 + 40} y2="430" />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 80 + 30} x2="800" y2={i * 80 + 30} />
          ))}
        </g>

        {/* יבשת ארה"ב (סכמטי) */}
        <path
          d="M0,95 L120,80 L260,60 L420,45 L560,30 L700,18 L800,10 L800,0 L0,0 Z"
          fill="#4a5548"
          opacity="0.55"
        />
        {/* חצי האי פלורידה (סכמטי) */}
        <path
          d="M355,45 Q380,80 398,120 Q412,152 420,175 L404,180 Q388,150 372,115 Q358,82 340,50 Z"
          fill="#4a5548"
          opacity="0.7"
        />
        {/* קובה (סכמטי) */}
        <path
          d="M370,235 Q430,212 505,220 Q560,226 595,244 Q555,262 490,256 Q425,252 370,235 Z"
          fill="#5c6a4e"
        />

        {/* טווח MRBM — 2,000 ק"מ */}
        <circle cx="460" cy="238" r="150" fill="none" stroke="#a8b184" strokeWidth="1.6" strokeDasharray="7 5" />
        {/* טווח IRBM — 4,500 ק"מ */}
        <circle cx="460" cy="238" r="315" fill="none" stroke="#d3c39a" strokeWidth="1.3" strokeDasharray="3 7" opacity="0.85" />

        {/* אתרי השיגור */}
        <g stroke="#c24b42" strokeWidth="2.2">
          <line x1="415" y1="228" x2="429" y2="242" />
          <line x1="429" y1="228" x2="415" y2="242" />
        </g>
        <text x="436" y="248" fontSize="13" fill="#c96f66" fontFamily="monospace">סן כריסטובל</text>

        {/* ערים */}
        <circle cx="680" cy="42" r="5" fill="#e9dfc4" />
        <text x="668" y="66" fontSize="13" fill="#e9dfc4" fontFamily="monospace">וושינגטון</text>
        <circle cx="412" cy="176" r="4" fill="#a8b184" />
        <text x="424" y="180" fontSize="12" fill="#a8b184" fontFamily="monospace">מיאמי</text>
        <circle cx="440" cy="230" r="4" fill="#e9dfc4" />
        <text x="400" y="278" fontSize="12" fill="#e9dfc4" fontFamily="monospace">הוואנה</text>

        {/* תוויות טווח */}
        <text x="560" y="330" fontSize="13" fill="#a8b184" fontFamily="monospace">MRBM · ‎2,000 ק"מ</text>
        <text x="640" y="404" fontSize="13" fill="#d3c39a" fontFamily="monospace">IRBM · ‎4,500 ק"מ</text>

        {/* שושנת רוחות מינימלית */}
        <g transform="translate(52,352)" stroke="#8b957f" fill="none" strokeWidth="1.2">
          <circle r="20" opacity="0.7" />
          <line x1="0" y1="-26" x2="0" y2="26" />
          <line x1="-26" y1="0" x2="26" y2="0" />
        </g>
        <text x="46" y="318" fontSize="11" fill="#8b957f" fontFamily="monospace">N</text>
      </svg>
      <figcaption className="range-map-caption">
        איור סכמטי להמחשה — מבוסס על מפות התדריך שהוצגו לציבור האמריקאי באוקטובר 1962
      </figcaption>
    </figure>
  );
}
