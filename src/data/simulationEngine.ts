// מנוע הסימולציה המסתעפת: בונה את תגובת הסוכן והחלופות באופן דטרמיניסטי
// מתוך תכנון הסוכן, מקורות הידע, מגבלות הבטיחות ואיכות הפרומפט.
// אין כאן AI אמיתי — יש כאן שיעור על איך הגדרות משנות התנהגות.

import { StudentWork } from '../types';
import { promptTemplate, ActionOption, actionOptions } from './content';
import { evaluatePrompt, RubricResult } from './promptRubric';

export interface SimFact {
  text: string;
  confidence: 'גבוהה' | 'בינונית' | 'נמוכה';
  fabricated?: boolean;
}

export interface DebriefNote {
  kind: 'hallucination' | 'gap' | 'quality' | 'safety' | 'praise';
  icon: string;
  text: string;
}

export interface SimResult {
  quality: 'low' | 'mid' | 'high';
  rubric: RubricResult;
  roleFlavor: string;
  summary: string;
  facts: SimFact[];
  assessment: string;
  gaps: string[];
  separatesFacts: boolean;
  showsConfidence: boolean;
  options: ActionOption[];
  debrief: DebriefNote[];
}

const roleFlavors: Record<string, { flavor: string; summary: string }> = {
  'אנליסט מודיעין': {
    flavor: 'הסוכן פועל כאנליסט מודיעין: מצליב את המברק עם שאר החומר ומגיש תמונת מצב.',
    summary: 'חרושצ׳וב מאותת על נכונות לנסיגה — אך דורש מחיר: התחייבות אמריקאית שלא לפלוש לקובה.',
  },
  'יועץ דיפלומטי': {
    flavor: 'הסוכן פועל כיועץ דיפלומטי: מתמקד בשאלה אילו מהלכים לא־צבאיים המכתב מאפשר.',
    summary: 'המכתב פותח חלון למשא ומתן. השאלה אינה אם לענות — אלא איך לענות בלי לסגור את החלון.',
  },
  'מתרגם כוונות': {
    flavor: 'הסוכן פועל כמתרגם כוונות: מנתח את הטון, הסגנון והרמזים שבין השורות.',
    summary: 'הטון האישי והרגשי חריג מאוד. ההערכה: חרושצ׳וב כותב בעצמו, תחת לחץ, ומחפש דרך החוצה.',
  },
  'מנהל זמן משבר': {
    flavor: 'הסוכן פועל כמנהל זמן משבר: ממפה מה דחוף באמת ומה יכול לחכות.',
    summary: 'המכתב יוצר חלון הזדמנות שעלול להיסגר תוך ימים — התגובה אליו היא כעת ההחלטה הדחופה ביותר.',
  },
};

const defaultFlavor = {
  flavor: 'לסוכן לא הוגדר תפקיד, ולכן הוא מנתח באופן כללי.',
  summary: 'התקבל מכתב מחרושצ׳וב. נראה שיש בו הצעה כלשהי.',
};

/** עובדות לפי מקורות ידע — הסוכן "רואה" רק את מה שחיברתם אליו */
const sourceFacts: { source: string; fact: SimFact }[] = [
  {
    source: 'מברקים דיפלומטיים מוצפנים',
    fact: { text: 'המכתב נשלח בערוץ אישי ולא רשמי — עקיפה מכוונת של הצינורות הדיפלומטיים', confidence: 'גבוהה' },
  },
  {
    source: 'תצלומי לוויין של טיסות U-2',
    fact: { text: 'העבודה באתרי השיגור נמשכת גם בזמן כתיבת המכתב — ההצעה אינה מלווה בהאטה בשטח', confidence: 'גבוהה' },
  },
  {
    source: 'פרוטוקולים של דיוני EXCOMM',
    fact: { text: 'ב־EXCOMM מסתמנת מחלוקת: הניצים רואים במכתב תכסיס, היונים — פתח אמיתי', confidence: 'בינונית' },
  },
  {
    source: 'פרופילים אישיותיים של קנדי וחרושצ׳וב',
    fact: { text: 'הסגנון האישי במכתב תואם את דפוס הכתיבה של חרושצ׳וב עצמו, לא של מנסחי הקרמלין', confidence: 'בינונית' },
  },
  {
    source: 'דוחות מרגלים מהשטח בקובה',
    fact: { text: 'מקורות בהוואנה מדווחים על מתיחות בין הפיקוד הסובייטי המקומי למוסקבה', confidence: 'נמוכה' },
  },
  {
    source: 'עיתונות בינלאומית פתוחה',
    fact: { text: 'העיתונות העולמית עדיין לא יודעת על המכתב — יש מרחב לפעולה שקטה', confidence: 'בינונית' },
  },
];

/** ההזיה: פרט בדוי שהסוכן "ממציא" כשלא הוגדרה מגבלת אמינות */
export const hallucinatedFact: SimFact = {
  text: 'לפי מקור בכיר במוסקבה, חרושצ׳וב כבר חתם בסתר על צו נסיגה מלא שייכנס לתוקף מחר בבוקר',
  confidence: 'גבוהה',
  fabricated: true,
};

/** חלופה צבאית שמופיעה רק אם לא הוגדרה מגבלת "לא ממליץ על פעולה צבאית" */
export const militaryOption: ActionOption = {
  id: 'air-strike',
  icon: '✈️',
  title: 'תקיפה אווירית מיידית על אתרי הטילים',
  description: 'להשמיד את האתרים לפני שיהיו מבצעיים, כפי שדרשו הגנרלים.',
  risk: 'גבוה',
  outcome:
    'זה מה שרוב הגנרלים דרשו — וקנדי סירב. שנים אחר כך התברר שבקובה כבר היו טילים טקטיים מבצעיים ועשרות אלפי חיילים סובייטים. היסטוריונים מעריכים שתקיפה הייתה מדרדרת למלחמה גרעינית. שימו לב: הסוכן שלכם הציע זאת כי לא הגדרתם לו מגבלה על המלצות צבאיות.',
};

export function buildSimulation(work: StudentWork): SimResult {
  const { agentConfig } = work;
  const promptText =
    work.promptText ?? promptTemplate(agentConfig.name, agentConfig.role);
  const rubric = evaluatePrompt(promptText, agentConfig);
  const quality: SimResult['quality'] =
    rubric.band === 'draft' ? 'low' : rubric.band === 'progress' ? 'mid' : 'high';

  const roleKey = Object.keys(roleFlavors).find((k) => agentConfig.role.startsWith(k));
  const { flavor, summary } = roleKey ? roleFlavors[roleKey] : defaultFlavor;

  const noFabrication = agentConfig.safetyLimits.some((l) => l.includes('לא ממציא עובדות'));
  const showsConfidence = agentConfig.safetyLimits.some((l) => l.includes('רמת ודאות'));
  const separatesFacts = agentConfig.safetyLimits.some((l) => l.includes('מפריד בין עובדות'));
  const noMilitary = agentConfig.safetyLimits.some((l) => l.includes('לא ממליץ על פעולה צבאית'));

  const facts: SimFact[] = sourceFacts
    .filter((sf) => agentConfig.knowledgeSources.includes(sf.source))
    .map((sf) => sf.fact);

  const debrief: DebriefNote[] = [];
  const gaps: string[] = [];

  if (!agentConfig.knowledgeSources.includes('תצלומי לוויין של טיסות U-2')) {
    gaps.push('אין לי גישה לתצלומי לוויין — איני יכול לאמת מה קורה באתרי השיגור בפועל.');
  }
  if (facts.length < 2) {
    gaps.push('חיברתם אליי מעט מקורות — הניתוח שלי מבוסס על תמונה חלקית מאוד.');
    debrief.push({
      kind: 'gap',
      icon: '📚',
      text: 'הסוכן קיבל פחות משני מקורות ידע, ולכן הניתוח דל. חזרו לשלב 2 והרחיבו את מקורות הידע.',
    });
  }

  if (!noFabrication) {
    facts.push(hallucinatedFact);
    debrief.push({
      kind: 'hallucination',
      icon: '👻',
      text: 'שימו לב! הסוכן "דיווח" שחרושצ׳וב כבר חתם על צו נסיגה — פרט שלא מופיע באף מקור. זו הזיה (Hallucination). היא קרתה כי לא בחרתם את המגבלה "לא ממציא עובדות". דמיינו החלטה נשיאותית שמתבססת על זה.',
    });
  } else {
    debrief.push({
      kind: 'praise',
      icon: '🛡️',
      text: 'המגבלה "לא ממציא עובדות" עבדה: הסוכן דיווח רק ממה שקיים במקורות, וסימן פערים כ"לא ידוע" במקום למלא אותם בדמיון.',
    });
  }

  if (!showsConfidence) {
    debrief.push({
      kind: 'safety',
      icon: '⚖️',
      text: 'הסוכן לא מציין רמות ודאות, כך שאי אפשר לדעת אילו קביעות חזקות ואילו חלשות. הוסיפו את מגבלת "מציין רמת ודאות לכל קביעה".',
    });
  }

  if (quality === 'low') {
    debrief.push({
      kind: 'quality',
      icon: '⌨️',
      text: `הפרומפט קיבל ${rubric.total}/${rubric.max} במחוון, ולכן הפלט כללי ומעורפל. חזרו לשלב 3 וחזקו את הקריטריונים החסרים — ותראו את ההבדל בניתוח.`,
    });
  } else if (quality === 'high') {
    debrief.push({
      kind: 'praise',
      icon: '🎖️',
      text: `פרומפט מבצעי (${rubric.total}/${rubric.max}) — הניתוח מובנה, ממוקד ומופרד לעובדות והערכות. כך נראית הנדסת פרומפטים טובה.`,
    });
  }

  const assessment =
    quality === 'low'
      ? 'המצב מורכב. ייתכן שהמכתב חשוב. אולי כדאי לשקול צעדים נוספים ולהמשיך לעקוב.'
      : roleKey === 'מתרגם כוונות'
        ? 'הפנייה האישית עוקפת את הצמרת הסובייטית. שילוב הטון הרגשי עם היעדר אולטימטום מרמז על מצוקה אמיתית ולא על תכסיס. חלון ההזדמנות אמיתי אך שביר.'
        : 'חרושצ׳וב מחפש דרך לצאת מהמשבר בלי להשפיל את ברית המועצות. חלון ההזדמנות עשוי להיסגר אם הניצים במוסקבה ישתלטו על הערוץ.';

  const options: ActionOption[] = noMilitary
    ? [...actionOptions]
    : [...actionOptions, militaryOption];

  if (!noMilitary) {
    debrief.push({
      kind: 'safety',
      icon: '✈️',
      text: 'הסוכן כלל המלצה על תקיפה צבאית — כי לא הגבלתם אותו. מגבלות בטיחות אינן "קישוט": הן קובעות אילו דלתות הסוכן בכלל פותח.',
    });
  }

  return {
    quality,
    rubric,
    roleFlavor: flavor,
    summary: quality === 'low' ? defaultFlavor.summary : summary,
    facts,
    assessment,
    gaps,
    separatesFacts,
    showsConfidence,
    options,
    debrief,
  };
}
