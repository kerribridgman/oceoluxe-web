import { MarketingShell } from '@/components/marketing/marketing-shell';
import { PageHeader } from '@/components/marketing/page-header';
import { AnimateIn } from '@/components/animate-in';
import { ApplyForm } from './apply-form';

export default async function ApplyPage() {
  return (
    <MarketingShell>

      {/* Hero Section */}
      <PageHeader slotId="apply-hero-bg" height="40vh">
        <AnimateIn animation="fade-in">
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[var(--color-cream)] leading-[1.15] tracking-tight mb-6 text-glow-warm">
            Apply to Work With Oceo Luxe
          </h1>
          <p className="text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
            Oceo Luxe is application-only. Every partnership begins with a conversation. The studio is selective about who it works with because the work requires alignment on both sides. The application below is the first step.
          </p>
        </AnimateIn>
      </PageHeader>

      <ApplyForm />

    </MarketingShell>
  );
}
