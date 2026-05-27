interface HeaderOverlayProps {
  variant?: 'gradient' | 'flat';
}

export function HeaderOverlay({ variant = 'gradient' }: HeaderOverlayProps) {
  const style = variant === 'gradient'
    ? { background: 'linear-gradient(to top, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.45) 100%)' }
    : { background: 'rgba(26,26,26,0.6)' };

  return (
    <div
      className="absolute inset-0 z-[1]"
      style={style}
      aria-hidden="true"
    />
  );
}
