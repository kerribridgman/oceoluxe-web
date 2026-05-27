import Image from 'next/image';
import { MEDIA_SLOTS } from './media-slots';
import { MediaSlotEmpty } from './media-slot-empty';

interface MediaSlotProps {
  slotId: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function MediaSlot({ slotId, className = '', sizes = '(max-width: 768px) 100vw, 50vw', priority = false }: MediaSlotProps) {
  const config = MEDIA_SLOTS[slotId];

  if (!config) {
    return null;
  }

  if (!config.src) {
    return (
      <MediaSlotEmpty
        slotId={config.slotId}
        label={config.label}
        meta={config.meta}
        className={`rounded-lg ${className}`}
      />
    );
  }

  return (
    <div data-slot-id={slotId} className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={config.src}
        alt={config.alt || ''}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
