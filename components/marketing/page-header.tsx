import { HeaderMedia } from './header-media';
import { HeaderOverlay } from './header-overlay';

interface PageHeaderProps {
  slotId: string;
  height?: '80vh' | '60vh' | '40vh';
  priority?: boolean;
  children: React.ReactNode;
}

export function PageHeader({ slotId, height = '60vh', priority = false, children }: PageHeaderProps) {
  return (
    <section
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: height }}
    >
      <HeaderMedia slotId={slotId} priority={priority} />
      <HeaderOverlay />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 lg:pt-36 w-full" style={{ paddingBottom: 'var(--space-hero-bottom)' }}>
        {children}
      </div>
    </section>
  );
}
