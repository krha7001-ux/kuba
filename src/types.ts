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
