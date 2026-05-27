interface MediaSlotEmptyProps {
  slotId: string;
  label: string;
  meta: string;
  className?: string;
}

export function MediaSlotEmpty({ slotId, label, meta, className = '' }: MediaSlotEmptyProps) {
  return (
    <div
      data-slot-id={slotId}
      className={`flex flex-col items-center justify-center bg-[var(--color-charcoal)] ${className}`}
    >
      <span className="text-label text-[var(--color-taupe)]">{label}</span>
      <span className="text-xs text-[var(--color-taupe)] opacity-50 mt-2">{meta}</span>
    </div>
  );
}
