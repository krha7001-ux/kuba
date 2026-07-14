export interface AgentConfig {
  name: string;
  role: string;
  knowledgeSources: string[];
  safetyLimits: string[];
  outputType: string;
}

export const emptyAgentConfig: AgentConfig = {
  name: '',
  role: '',
  knowledgeSources: [],
  safetyLimits: [],
  outputType: '',
};

/** כל עבודת התלמיד — נשמרת ב־localStorage כדי לשרוד רענון דף */
export interface StudentWork {
  step: number;
  agentConfig: AgentConfig;
  /** docId -> questionId -> optionId שנבחר */
  docAnswers: Record<string, Record<string, string>>;
  /** ראיות שנבחרו בלוח הראיות */
  evidenceIds: string[];
  /** צוואר הבקבוק המרכזי שנבחר בלוח הראיות */
  mainBottleneckId: string;
  /** הניסוח החופשי של התלמיד */
  bottleneckStatement: string;
  /** null = התלמיד עדיין לא ערך; מוצגת התבנית האוטומטית */
  promptText: string | null;
  simulationChoice: string | null;
  reflectionAnswers: Record<string, string>;
}

export const emptyStudentWork: StudentWork = {
  step: 0,
  agentConfig: emptyAgentConfig,
  docAnswers: {},
  evidenceIds: [],
  mainBottleneckId: '',
  bottleneckStatement: '',
  promptText: null,
  simulationChoice: null,
  reflectionAnswers: {},
};
