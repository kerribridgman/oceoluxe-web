'use client';

import Image from 'next/image';
import { MEDIA_SLOTS } from './media-slots';
import { MediaSlotEmpty } from './media-slot-empty';

interface HeaderMediaProps {
  slotId: string;
  priority?: boolean;
}

export function HeaderMedia({ slotId, priority = false }: HeaderMediaProps) {
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
        className="absolute inset-0 z-0"
      />
    );
  }

  if (config.type === 'video') {
    return (
      <video
        data-slot-id={slotId}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={config.src}
      >
        <source src={config.src} />
      </video>
    );
  }

  return (
    <Image
      data-slot-id={slotId}
      src={config.src}
      alt={config.alt || ''}
      fill
      className="object-cover z-0"
      sizes="100vw"
      priority={priority}
    />
  );
}
