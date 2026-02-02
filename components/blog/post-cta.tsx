import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function PostCta() {
  return (
    <div className="my-16 rounded-xl border border-[#CDA7B2]/20 bg-white p-8 md:p-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Quiz CTA */}
        <div className="space-y-3">
          <p className="text-[#CDA7B2] text-xs uppercase tracking-widest font-medium">
            Discover Your Style
          </p>
          <h3 className="text-xl font-light text-[#3B3937] tracking-tight">
            Find Your Designer Archetype
          </h3>
          <p className="text-sm text-[#967F71] font-light leading-relaxed">
            Take our free quiz to uncover your production personality and get tailored recommendations.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center text-[#CDA7B2] hover:text-[#BD97A2] font-medium text-sm transition-colors"
          >
            Take the Quiz
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Services CTA */}
        <div className="space-y-3 md:border-l md:border-[#967F71]/10 md:pl-8">
          <p className="text-[#CDA7B2] text-xs uppercase tracking-widest font-medium">
            Ready to Build?
          </p>
          <h3 className="text-xl font-light text-[#3B3937] tracking-tight">
            Need Help With Production Systems?
          </h3>
          <p className="text-sm text-[#967F71] font-light leading-relaxed">
            We set up factory communication, supplier tracking, and Notion dashboards tailored to your workflow.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center text-[#967F71] hover:text-[#3B3937] font-medium text-sm transition-colors"
          >
            View Services
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
