import { useEffect, useState } from 'react';
import { StudentWork, emptyStudentWork } from '../types';

const STORAGE_KEY = 'kuba-fde-student-work-v1';

function load(): StudentWork {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StudentWork>;
      return {
        ...emptyStudentWork,
        ...parsed,
        agentConfig: { ...emptyStudentWork.agentConfig, ...parsed.agentConfig },
        promptSections: { ...emptyStudentWork.promptSections, ...parsed.promptSections },
      };
    }
  } catch {
    // אחסון לא זמין או JSON פגום — מתחילים מעבודה ריקה
  }
  return emptyStudentWork;
}

export function useStudentWork() {
  const [work, setWork] = useState<StudentWork>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(work));
    } catch {
      // אחסון מלא/חסום — האפליקציה ממשיכה לעבוד בזיכרון בלבד
    }
  }, [work]);

  const update = (patch: Partial<StudentWork>) =>
    setWork((w) => ({ ...w, ...patch }));

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // מתעלמים — ה־state מתאפס בכל מקרה
    }
    setWork(emptyStudentWork);
  };

  return { work, update, reset };
}
