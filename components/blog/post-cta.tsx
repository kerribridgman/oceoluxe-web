import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function PostCta() {
  return (
    <div className="my-16 rounded-xl border border-[var(--color-dusty-rose)]/20 bg-[var(--color-charcoal)] p-8 md:p-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Studio Systems CTA */}
        <div className="space-y-3">
          <p className="text-[var(--color-dusty-rose)] text-xs uppercase tracking-widest font-medium">
            Studio Systems
          </p>
          <h3 className="text-xl font-light text-[var(--color-cream)] tracking-tight">
            Operational Systems for Fashion Brands
          </h3>
          <p className="text-sm text-[var(--color-bone)] font-light leading-relaxed">
            Production frameworks, supplier management, and live Q&A. Built from real-world production leadership.
          </p>
          <Link
            href="/studio-systems"
            className="inline-flex items-center text-[var(--color-cream)] hover:text-[var(--color-dusty-rose)] font-medium text-sm transition-colors"
          >
            Explore Studio Systems
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Partnership CTA */}
        <div className="space-y-3 md:border-l md:border-[var(--color-taupe)]/10 md:pl-8">
          <p className="text-[var(--color-dusty-rose)] text-xs uppercase tracking-widest font-medium">
            Work Together
          </p>
          <h3 className="text-xl font-light text-[var(--color-cream)] tracking-tight">
            Strategic Operational Partnership
          </h3>
          <p className="text-sm text-[var(--color-bone)] font-light leading-relaxed">
            Embedded production leadership and systems architecture for fashion brands ready to operate at a higher level.
          </p>
          <Link
            href="/work-with-oceo-luxe"
            className="inline-flex items-center text-[var(--color-bone)] hover:text-[var(--color-cream)] font-medium text-sm transition-colors"
          >
            Learn More
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
