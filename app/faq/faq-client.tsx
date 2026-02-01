'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export interface FAQItem {
  question: string;
  answer: string;
}

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#EDEBE8]">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left hover:bg-[#faf8f5]/50 transition-colors"
      >
        <span className="text-lg font-serif font-light text-[#3B3937] pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-[#CDA7B2] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
      >
        <p className="text-[#967F71] font-light leading-relaxed pr-12">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQClient({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#f5f0ea] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center relative">
          {/* Decorative circles */}
          <div
            className="absolute top-8 right-4 w-20 h-20 rounded-full bg-[#CDA7B2] opacity-20 animate-float hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/3 -left-8 w-14 h-14 rounded-full bg-[#967F71] opacity-15 animate-float-slow hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-8 left-8 w-8 h-8 rounded-full bg-[#CDA7B2] opacity-25 animate-float-delayed hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-4 right-16 w-12 h-12 rounded-full bg-[#967F71] opacity-10 animate-float hidden lg:block"
            aria-hidden="true"
          />

          <h1 className="text-5xl md:text-6xl font-serif font-light text-[#3B3937] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Common questions from designers navigating production for the first time.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-light text-[#3B3937] mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-[#967F71] font-light mb-8">
            Take the quiz to discover your designer archetype, or reach out directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <Button
                size="lg"
                className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-14 px-10 text-lg font-light group"
              >
                Take the Quiz
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="mailto:kerrib@oceoluxe.com">
              <Button
                size="lg"
                variant="outline"
                className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-14 px-10 text-lg font-light"
              >
                Get in Touch
              </Button>
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
