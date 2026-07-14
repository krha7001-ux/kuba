import { Phase } from '../App';

interface PhaseBannerProps {
  phase: Phase;
  phaseIndex: number;
}

export default function PhaseBanner({ phase, phaseIndex }: PhaseBannerProps) {
  return (
    <div className={`phase-banner phase-tone-${phaseIndex}`}>
      <span className="phase-banner-icon">{phase.icon}</span>
      <div>
        <strong>{phase.label}</strong>
        <span className="phase-banner-desc">{phase.desc}</span>
      </div>
      <div className="phase-banner-dots" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <i key={n} className={phaseIndex >= n ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}
