'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I find a factory?",
    answer: "Start by getting clear on what you need: your product type, estimated quantities, and timeline. Then research factories that specialize in your category. Trade shows, industry directories, and referrals from other designers are good starting points. Most importantly, don't rush this decision. Vet multiple factories, ask for references, and if possible, visit in person before committing."
  },
  {
    question: "How many units should I produce for my first run?",
    answer: "There's no universal answer, but for most independent designers, starting smaller is smarter. Many factories have minimums (MOQs) ranging from 50-300 units per style. Consider your budget, storage capacity, and realistic sales projections. It's better to sell out and reorder than to sit on inventory you can't move. Your archetype and brand positioning also play a role in this decision."
  },
  {
    question: "What's a realistic production timeline?",
    answer: "For a first production run, expect 4-6 months from design finalization to delivery. This includes sampling (4-8 weeks), revisions (2-4 weeks), production (4-8 weeks), and shipping. Timelines are layered, not linear, meaning delays in one area affect everything downstream. Build in buffer time and communicate proactively with your factory."
  },
  {
    question: "How do I communicate effectively with my factory?",
    answer: "Clarity is everything. Provide detailed tech packs with measurements, construction details, and reference images. Be specific about fabrics, trims, and finishes. Ask questions when you don't understand something. Establish who your main point of contact is and preferred communication methods. Document everything in writing so there's no ambiguity."
  },
  {
    question: "What fabrics work best for small batch production?",
    answer: "Stock fabrics (fabrics already produced and available) are usually easier for small batches since they don't require high minimums. Natural fibers like cotton, linen, and silk are often available in lower quantities. Avoid fabrics that require custom dyeing or finishing unless you can meet minimums. Your factory can often suggest alternatives that achieve a similar look within your constraints."
  },
  {
    question: "What should I look for when visiting a factory?",
    answer: "Observe cleanliness, organization, and workflow. Watch how workers communicate between departments. Ask about their typical timeline, who your contact will be, and what their current workload looks like. Bring reference samples and fabric swatches. Pay attention to red flags: disorganization, reluctance to answer questions, or pressure to commit quickly."
  },
  {
    question: "How do I price my products?",
    answer: "Start with your true cost of goods (materials, labor, shipping, duties). Then factor in overhead, marketing costs, and your desired profit margin. Research comparable brands to understand market positioning. Most designers use a 2.5-4x markup from cost to wholesale, and 2x from wholesale to retail. Your pricing should reflect your brand positioning and target customer."
  },
  {
    question: "What if my factory makes a mistake?",
    answer: "First, document everything with photos and detailed descriptions. Review your original specs to confirm the error is on their end. Communicate calmly and clearly about the issue. Most reputable factories will work to resolve legitimate errors. Having clear documentation (tech packs, approval samples, written confirmations) protects both parties. This is why clear communication upfront matters so much."
  },
  {
    question: "How do I produce sustainably without being perfect?",
    answer: "Sustainability is a journey, not a checkbox. Start where you can: choose natural fibers, work with local or transparent suppliers, produce in smaller quantities to reduce waste. You don't need every certification on day one. Focus on making intentional choices and being honest with your customers about where you are and where you're headed."
  },
  {
    question: "What's the difference between working with you 1:1 vs joining Studio Systems?",
    answer: "Studio Systems is a membership that gives you access to frameworks, templates, courses, and community support to build your production systems at your own pace. It's ideal if you want ongoing guidance and resources. 1:1 consulting is for designers who need personalized strategy, custom system setup, or hands-on support for specific challenges. Many members start with Studio Systems and add 1:1 support when needed."
  }
];

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

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#f5f0ea]">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-light text-[#3B3937] mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed">
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
