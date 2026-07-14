import { Phase } from '../App';

interface StepNavProps {
  steps: ReadonlyArray<{
    readonly id: string;
    readonly label: string;
    readonly icon: string;
    readonly phase: number;
  }>;
  phases: Phase[];
  current: number;
  onSelect: (i: number) => void;
}

export default function StepNav({ steps, phases, current, onSelect }: StepNavProps) {
  return (
    <nav className="step-nav" aria-label="שלבי הפעילות">
      <div className="step-nav-track">
        {phases.map((phase, pi) => {
          const phaseSteps = steps
            .map((s, i) => ({ ...s, index: i }))
            .filter((s) => s.phase === pi);
          if (phaseSteps.length === 0) return null;
          const isCurrentPhase = steps[current].phase === pi;
          return (
            <div
              key={phase.id}
              className={`phase-group phase-tone-${pi} ${isCurrentPhase ? 'current' : ''}`}
            >
              <span className="phase-group-label">
                {phase.icon} {phase.short}
              </span>
              <div className="phase-group-chips">
                {phaseSteps.map((s) => (
                  <button
                    key={s.id}
                    className={`step-chip ${s.index === current ? 'active' : ''} ${
                      s.index < current ? 'done' : ''
                    }`}
                    onClick={() => onSelect(s.index)}
                    aria-current={s.index === current ? 'step' : undefined}
                  >
                    <span className="step-chip-icon">{s.icon}</span>
                    <span className="step-chip-label">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
