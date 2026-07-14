interface StepNavProps {
  steps: ReadonlyArray<{ readonly id: string; readonly label: string; readonly icon: string }>;
  current: number;
  onSelect: (i: number) => void;
}

export default function StepNav({ steps, current, onSelect }: StepNavProps) {
  return (
    <nav className="step-nav" aria-label="שלבי הפעילות">
      <div className="step-nav-track">
        {steps.map((s, i) => (
          <button
            key={s.id}
            className={`step-chip ${i === current ? 'active' : ''} ${i < current ? 'done' : ''}`}
            onClick={() => onSelect(i)}
            aria-current={i === current ? 'step' : undefined}
          >
            <span className="step-chip-icon">{s.icon}</span>
            <span className="step-chip-label">{s.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
