interface SectionDividerProps {
  variant?: 'line' | 'dots' | 'diamond';
  className?: string;
}

export function SectionDivider({ variant = 'line', className = '' }: SectionDividerProps) {
  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-4 py-2 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-[#CDA7B2]/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#CDA7B2]" />
        <span className="w-2 h-2 rounded-full bg-[#CDA7B2]/50" />
      </div>
    );
  }

  if (variant === 'diamond') {
    return (
      <div className={`flex items-center justify-center gap-4 py-2 ${className}`}>
        <div className="w-16 h-px bg-[#CDA7B2]/60" />
        <span className="w-3 h-3 rotate-45 bg-[#CDA7B2]" />
        <div className="w-16 h-px bg-[#CDA7B2]/60" />
      </div>
    );
  }

  // Default: simple line
  return (
    <div className={`flex justify-center py-2 ${className}`}>
      <div className="w-24 h-px bg-[#CDA7B2]" />
    </div>
  );
}
