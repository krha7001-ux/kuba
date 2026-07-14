// סדנת בניית הפרומפט: שישה רכיבים, הרכבה לפרומפט אחד, והערכת איכות פר־רכיב.
// ההערכה בוחנת שלמות ותוכן של כל רכיב (עוגנים, פועל+מושא+נמען, מבנה) — לא רק מילת מפתח בודדת.

export interface PromptSections {
  identity: string;
  context: string;
  mission: string;
  sources: string[];
  rules: string[];
  rulesExtra: string;
  format: string;
}

/** הטיוטה ההתחלתית — חלשה בכוונה (ניקוד פתיחה ~4/12). התלמידים משדרגים אותה בעצמם. */
export const initialPromptSections: PromptSections = {
  identity: 'אתה עוזר.',
  context: 'יש משבר בקובה.',
  mission: 'תעזור למקבלי ההחלטות.',
  sources: [],
  rules: [],
  rulesExtra: '',
  format: 'ענה בקצרה.',
};

export interface RuleOption {
  id: string;
  text: string;
}

export const ruleOptions: RuleOption[] = [
  { id: 'no-fabrication', text: 'אל תמציא עובדות — אם משהו לא מופיע במקורות, כתוב "לא ידוע".' },
  { id: 'fact-guess-missing', text: 'הפרד בכל תשובה בין עובדות מאומתות, השערות, ומידע חסר.' },
  { id: 'confidence', text: 'ציין רמת ודאות (גבוהה / בינונית / נמוכה) לכל קביעה.' },
  { id: 'no-military', text: 'אל תמליץ על פעולה צבאית התקפית — הצג רק חלופות דיפלומטיות ומנע.' },
  { id: 'no-leak', text: 'אל תחשוף בפלט פרטים מזהים על מקורות מודיעין רגישים.' },
];

export const formatPresets: { id: string; label: string; text: string }[] = [
  {
    id: 'brief',
    label: 'תקציר מודיעין',
    text: 'שורת סיכום אחת, ואחריה עד 5 נקודות: עובדות, הערכות, ו־2–3 חלופות פעולה מדורגות לפי סיכון.',
  },
  {
    id: 'table',
    label: 'טבלת חלופות',
    text: 'שורת מצב אחת, ואחריה טבלה קצרה: חלופה | יתרונות | סיכונים — עד 3 חלופות.',
  },
  {
    id: 'numbered',
    label: 'ניתוח ממוספר',
    text: 'שלושה סעיפים ממוספרים: 1) עובדות מאומתות 2) השערות ומידע חסר 3) המלצות מדורגות.',
  },
];

/** מרכיבים את ששת הרכיבים לפרומפט מערכת אחד. רכיבים ריקים מדולגים. */
export function assemblePrompt(s: PromptSections): string {
  const parts: string[] = [];
  if (s.identity.trim()) parts.push(s.identity.trim());
  if (s.context.trim()) parts.push(`ההקשר: ${s.context.trim()}`);
  if (s.mission.trim()) parts.push(`המשימה שלך: ${s.mission.trim()}`);
  if (s.sources.length) {
    parts.push(`מקורות מותרים — הסתמך אך ורק עליהם:\n${s.sources.map((x) => `- ${x}`).join('\n')}`);
  }
  const rules = [
    ...ruleOptions.filter((r) => s.rules.includes(r.id)).map((r) => r.text),
    ...(s.rulesExtra.trim() ? [s.rulesExtra.trim()] : []),
  ];
  if (rules.length) {
    parts.push(`כללי אמינות ובטיחות:\n${rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}`);
  }
  if (s.format.trim()) parts.push(`פורמט התשובה:\n${s.format.trim()}`);
  return parts.join('\n\n');
}

export type SectionScore = 0 | 1 | 2;

export interface SectionResult {
  id: string;
  icon: string;
  title: string;
  score: SectionScore;
  label: string;
  /** מה טוב / מה חסר — משוב קצר וספציפי */
  advice: string;
}

export interface RubricResult {
  perSection: SectionResult[];
  total: number;
  max: number;
  band: 'draft' | 'progress' | 'operational';
  bandLabel: string;
}

const scoreLabels: Record<SectionScore, string> = {
  0: 'חסר',
  1: 'חלקי',
  2: 'מפותח היטב',
};

const hasAny = (t: string, terms: string[]) => terms.some((x) => t.includes(x));
const countAny = (t: string, terms: string[]) => terms.filter((x) => t.includes(x)).length;

function evalIdentity(s: PromptSections): { score: SectionScore; advice: string } {
  const t = s.identity.trim();
  if (t.length < 4) return { score: 0, advice: 'כתבו מי הסוכן: פתחו ב"אתה..." ותנו לו שם ותחום מומחיות.' };
  const persona = hasAny(t, ['אתה', 'את ']);
  const role = hasAny(t, ['אנליסט', 'יועץ', 'מתרגם', 'מנהל', 'מודיעין', 'דיפלומט', 'מומחה', 'קצינ']);
  if (persona && role && t.length >= 15)
    return { score: 2, advice: 'לסוכן יש זהות ותחום מומחיות ברורים — הוא יודע "מי הוא".' };
  return {
    score: 1,
    advice: role
      ? 'יש תחום — אבל חסרה פנייה ישירה ("אתה...") שממקמת את הסוכן בתפקיד.'
      : '"עוזר" זה כללי מדי. איזה מומחה הסוכן? אנליסט מודיעין? יועץ דיפלומטי? מתרגם כוונות?',
  };
}

function evalContext(s: PromptSections): { score: SectionScore; advice: string } {
  const t = s.context.trim();
  const anchors = countAny(t, ['1962', 'קובה', 'קנדי', 'חרושצ', 'ברית המועצות', 'טילים', 'אוקטובר', 'מלחמה קרה', 'CIA']);
  if (t.length < 4 || anchors === 0)
    return { score: 0, advice: 'עגנו את הסוכן בזמן ובמקום: שנה (1962), מקום (קובה) ומה קורה (טילים סובייטיים).' };
  if (anchors >= 2 && t.length >= 20)
    return { score: 2, advice: 'הסוכן ממוקם היטב בזמן, במקום ובאירוע — הוא לא "מרחף" מחוץ להיסטוריה.' };
  return { score: 1, advice: '"יש משבר" — איזה משבר? הוסיפו לפחות שני עוגנים: שנה, מקום, מי מול מי.' };
}

function evalMission(s: PromptSections): { score: SectionScore; advice: string } {
  const t = s.mission.trim();
  if (t.length < 4) return { score: 0, advice: 'הגדירו מה הסוכן עושה בפועל: איזו פעולה, על איזה חומר, ועבור מי.' };
  const verb = hasAny(t, ['נתח', 'סכם', 'הערך', 'זהה', 'השווה', 'פענח', 'תרגם', 'הגש', 'דרג', 'הצג', 'הצלב']);
  const object = hasAny(t, ['מברק', 'תצלומ', 'מידע', 'כוונות', 'חלופות', 'תמונת מצב', 'מסמכ', 'איומ', 'מקורות']);
  const purpose = hasAny(t, ['לנשיא', 'EXCOMM', 'למקבלי', 'כדי', 'עבור', 'לחדר המצב']);
  if (verb && object && (purpose || t.length >= 30))
    return { score: 2, advice: 'משימה מבצעית: פעולה ברורה, על חומר מוגדר, עם תכלית.' };
  return {
    score: 1,
    advice: '"תעזור" זה לא משימה. נסחו: פועל (נתח / סכם / דרג) + חומר (מברקים, תצלומים) + נמען (הנשיא, EXCOMM).',
  };
}

function evalSources(s: PromptSections): { score: SectionScore; advice: string } {
  if (s.sources.length >= 2)
    return { score: 2, advice: `${s.sources.length} מקורות מתיק הלקוח משולבים בפרומפט — והסוכן מוגבל אליהם בלבד.` };
  if (s.sources.length === 1)
    return { score: 1, advice: 'מקור אחד זו תמונה חד־צדדית. בחרו לפחות שני מקורות כדי שהסוכן יוכל להצליב מידע.' };
  return { score: 0, advice: 'בלי רשימת מקורות, הסוכן "ימציא" מהידע הכללי שלו. בחרו לפחות שני מקורות מתיק הלקוח.' };
}

function evalRules(s: PromptSections): { score: SectionScore; advice: string } {
  const n = s.rules.length + (s.rulesExtra.trim().length >= 10 ? 1 : 0);
  const distinction = s.rules.includes('fact-guess-missing');
  if (distinction && n >= 2)
    return { score: 2, advice: 'יש הבחנה בין עובדות / השערות / מידע חסר + כללי בטיחות נוספים. סוכן ממושמע.' };
  if (n >= 1)
    return {
      score: 1,
      advice: distinction
        ? 'ההבחנה בין עובדות להשערות קיימת — הוסיפו עוד כלל בטיחות אחד לפחות (למשל "אל תמציא עובדות").'
        : 'חסר הכלל הקריטי: הפרדה בין עובדות מאומתות, השערות ומידע חסר. בלעדיו הכול נשמע אותו דבר.',
    };
  return { score: 0, advice: 'אפס כללים = סוכן שממציא בביטחון מלא. סמנו לפחות שניים, כולל את ההבחנה עובדות/השערות/חסר.' };
}

function evalFormat(s: PromptSections): { score: SectionScore; advice: string } {
  const t = s.format.trim();
  if (t.length < 4) return { score: 0, advice: 'הגדירו איך תיראה תשובה: אילו חלקים, באיזה סדר, ובאיזה אורך.' };
  const structure = countAny(t, ['נקודות', 'טבל', 'סעיפ', 'שורת סיכום', 'ממוספר', 'מדורג', 'עובדות', 'הערכות', 'חלופות', 'המלצות']);
  const bounded = /\d/.test(t) || hasAny(t, ['עד ', 'קצר']);
  if (structure >= 2 && bounded)
    return { score: 2, advice: 'פורמט מוגדר: מבנה קבוע וגבולות אורך. כל תשובה תיראה אותו דבר — וזה בדיוק הרעיון.' };
  return {
    score: 1,
    advice: '"בקצרה" זה כיוון, לא מבנה. פרטו חלקים (סיכום, עובדות, חלופות) וגבול אורך — או בחרו תבנית מוכנה.',
  };
}

export function evaluateSections(s: PromptSections): RubricResult {
  const perSection: SectionResult[] = [
    { id: 'identity', icon: '🎭', title: 'זהות ותפקיד הסוכן', ...evalIdentity(s) },
    { id: 'context', icon: '🌍', title: 'ההקשר ההיסטורי', ...evalContext(s) },
    { id: 'mission', icon: '🎯', title: 'המשימה', ...evalMission(s) },
    { id: 'sources', icon: '📚', title: 'המקורות המותרים', ...evalSources(s) },
    { id: 'rules', icon: '🛡️', title: 'אמינות ומגבלות בטיחות', ...evalRules(s) },
    { id: 'format', icon: '📤', title: 'פורמט התשובה', ...evalFormat(s) },
  ].map((x) => ({ ...x, label: scoreLabels[x.score] }));

  const total = perSection.reduce((sum, x) => sum + x.score, 0);
  const max = perSection.length * 2;
  const band = total <= 4 ? 'draft' : total <= 8 ? 'progress' : 'operational';
  const bandLabel =
    band === 'draft'
      ? '📝 טיוטה ראשונית — הסוכן עוד לא מוכן לשטח'
      : band === 'progress'
        ? '🔧 בדרך הנכונה — חסרות עוד הגדרות קריטיות'
        : '🎖️ פרומפט מבצעי — הסוכן מוכן להרצה';
  return { perSection, total, max, band, bandLabel };
}
