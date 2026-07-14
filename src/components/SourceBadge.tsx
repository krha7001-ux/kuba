import { useState } from 'react';
import { sourceLabels, sourceTypeInfo } from '../data/pedagogy';

interface SourceBadgeProps {
  docId: string;
}

/** תווית שקיפות: מה מקור המסמך — אותנטי, מעובד או מדומה */
export default function SourceBadge({ docId }: SourceBadgeProps) {
  const [open, setOpen] = useState(false);
  const label = sourceLabels[docId];
  if (!label) return null;
  const info = sourceTypeInfo[label.type];

  return (
    <div className="source-badge-wrap">
      <button
        className={`source-badge source-${label.type}`}
        onClick={() => setOpen(!open)}
        title="לחצו להסבר על מקור המסמך"
      >
        {info.icon} {info.label} {open ? '▴' : '▾'}
      </button>
      {open && <p className="source-note">{label.note}</p>}
    </div>
  );
}
