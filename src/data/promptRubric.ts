// מחוון איכות לפרומפט המערכת — הערכה אוטומטית ראשונית לפי שישה קריטריונים.
// כל קריטריון נבחן במספר אותות (לא מילת מפתח בודדת) ומדורג: 0 חסר, 1 חלקי, 2 מלא.

import { AgentConfig } from '../types';

export type RubricScore = 0 | 1 | 2;

export interface RubricCriterion {
  id: string;
  icon: string;
  title: string;
  what: string;
  levels: [string, string, string];
  tip: string;
  evaluate: (text: string, config: AgentConfig) => RubricScore;
}

/** כמה ביטויים מתוך הרשימה מופיעים בטקסט */
const hits = (text: string, terms: string[]) =>
  terms.filter((t) => text.includes(t)).length;

export const rubricCriteria: RubricCriterion[] = [
  {
    id: 'role',
    icon: '🎭',
    title: 'הגדרת תפקיד וזהות',
    what: 'הסוכן יודע מי הוא ומה תפקידו',
    levels: [
      'אין הגדרת זהות — הסוכן לא יודע מי הוא',
      'יש זהות כללית, אבל התפקיד לא מוגדר במפורש',
      'זהות ותפקיד מוגדרים בבירור',
    ],
    tip: 'פתחו ב"אתה..." והוסיפו משפט "התפקיד שלך: ..." שמגדיר מה הסוכן עושה.',
    evaluate: (text) => {
      const identity = hits(text, ['אתה ', 'את ']) > 0;
      const role =
        hits(text, ['תפקיד', 'אנליסט', 'יועץ', 'מתרגם', 'מנהל']) > 0;
      if (identity && role) return 2;
      if (identity || role) return 1;
      return 0;
    },
  },
  {
    id: 'context',
    icon: '🌍',
    title: 'הקשר היסטורי',
    what: 'הסוכן ממוקם בזמן, במקום ובאירוע הנכונים',
    levels: [
      'אין עיגון היסטורי — הסוכן "מרחף" מחוץ לזמן',
      'עיגון חלקי — חסרים פרטי זמן/מקום/אירוע',
      'ההקשר מלא: 1962, קובה, טיב המשבר',
    ],
    tip: 'ציינו לפחות שניים: השנה (1962), המקום (קובה), ומה קורה (טילים סובייטיים, משבר).',
    evaluate: (text) => {
      const n = hits(text, ['1962', 'קובה', 'משבר', 'חרושצ׳וב', 'קנדי', 'ברית המועצות', 'CIA']);
      if (n >= 3) return 2;
      if (n >= 1) return 1;
      return 0;
    },
  },
  {
    id: 'sources',
    icon: '📚',
    title: 'שימוש במקורות',
    what: 'הסוכן יודע על אילו מקורות להתבסס — ורק עליהם',
    levels: [
      'אין אזכור למקורות — הסוכן חופשי "להמציא" מהידע הכללי',
      'אזכור כללי ("המסמכים") בלי לנקוב במקורות ספציפיים',
      'המקורות נקובים במפורש והסוכן מוגבל אליהם',
    ],
    tip: 'כתבו "הסתמך רק על..." ומנו את המקורות שבחרתם: תצלומים, מברקים, פרוטוקולים וכו׳.',
    evaluate: (text) => {
      const restrict = hits(text, ['רק על', 'אך ורק', 'הסתמך', 'התבסס']) > 0;
      const specific =
        hits(text, ['תצלומ', 'מברק', 'פרוטוקול', 'פרופיל', 'דוח', 'עיתונות', 'לוויין']) > 0;
      const generic = hits(text, ['מסמכ', 'מקורות', 'מידע שקיבלת']) > 0;
      if (restrict && specific) return 2;
      if (specific || (restrict && generic) || generic) return 1;
      return 0;
    },
  },
  {
    id: 'limits',
    icon: '🛡️',
    title: 'מגבלות בטיחות',
    what: 'לסוכן אסור להמציא, ויש גבולות למה שמותר לו להמליץ',
    levels: [
      'אין אף מגבלה — הסוכן יכול להמציא ולהמליץ על הכול',
      'מגבלה אחת בלבד',
      'שתי מגבלות או יותר, מנוסחות כציוויים ברורים',
    ],
    tip: 'הוסיפו לפחות שני כללי "אל": "אל תמציא עובדות", "אל תמליץ על תקיפה", "אם אין מידע — אמור שלא ידוע".',
    evaluate: (text) => {
      const n = hits(text, [
        'אל תמציא', 'לא ממציא', 'אל תמליץ', 'לא ידוע', 'אסור',
        'אל תחשוף', 'רק חלופות', 'הימנע',
      ]);
      if (n >= 2) return 2;
      if (n === 1) return 1;
      return 0;
    },
  },
  {
    id: 'fact-vs-guess',
    icon: '⚖️',
    title: 'הבחנה בין עובדה להשערה',
    what: 'הסוכן מסמן מה מאומת, מה הערכה, ובאיזו רמת ודאות',
    levels: [
      'אין הבחנה — עובדות והשערות יתערבבו בפלט',
      'יש אזכור לעובדות או להערכות, אבל בלי דירוג ודאות',
      'נדרשת הפרדה מפורשת + ציון רמת ודאות',
    ],
    tip: 'דרשו: "הפרד בין עובדות לבין הערכות" וגם "ציין רמת ודאות (גבוהה/בינונית/נמוכה) לכל קביעה".',
    evaluate: (text) => {
      const separate =
        hits(text, ['עובד']) > 0 && hits(text, ['הערכ', 'השער', 'פרשנות']) > 0;
      const confidence = hits(text, ['ודאות', 'גבוהה / בינונית / נמוכה']) > 0;
      if (separate && confidence) return 2;
      if (separate || confidence) return 1;
      return 0;
    },
  },
  {
    id: 'format',
    icon: '📤',
    title: 'פורמט פלט',
    what: 'ברור איך תיראה תשובה של הסוכן',
    levels: [
      'אין דרישת פורמט — כל תשובה תיראה אחרת',
      'יש כיוון כללי (למשל "בקצרה") בלי מבנה מוגדר',
      'מבנה פלט מוגדר: סעיפים, סדר, אורך',
    ],
    tip: 'הגדירו מבנה: "פורמט הפלט: שורת סיכום, עובדות, הערכה, 2–3 חלופות" או טבלה.',
    evaluate: (text) => {
      const structure = hits(text, ['פורמט', 'מבנה', 'טבל']) > 0;
      const parts = hits(text, ['נקודות', 'סיכום', 'סעיפ', 'שורת', 'מדורג', 'עד 5']) >= 2;
      if (structure && parts) return 2;
      if (structure || parts) return 1;
      return 0;
    },
  },
];

export interface RubricResult {
  perCriterion: { criterion: RubricCriterion; score: RubricScore }[];
  total: number;
  max: number;
  band: 'draft' | 'progress' | 'operational';
  bandLabel: string;
}

export function evaluatePrompt(text: string, config: AgentConfig): RubricResult {
  const perCriterion = rubricCriteria.map((criterion) => ({
    criterion,
    score: criterion.evaluate(text, config),
  }));
  const total = perCriterion.reduce((s, c) => s + c.score, 0);
  const max = rubricCriteria.length * 2;
  const band = total <= 4 ? 'draft' : total <= 8 ? 'progress' : 'operational';
  const bandLabel =
    band === 'draft'
      ? '📝 טיוטה ראשונית — הסוכן עוד לא מוכן לשטח'
      : band === 'progress'
        ? '🔧 בדרך הנכונה — חסרות עוד הגדרות קריטיות'
        : '🎖️ פרומפט מבצעי — הסוכן מוכן להרצה';
  return { perCriterion, total, max, band, bandLabel };
}
