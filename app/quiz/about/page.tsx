import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target, Compass } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export default function QuizAboutPage() {
  const reasons = [
    {
      icon: <Target className="h-8 w-8 text-[#CDA7B2]" />,
      title: "Align Your Production Strategy",
      description: "Your archetype reveals how you naturally create—so you can build production systems that work with your vision, not against it."
    },
    {
      icon: <Compass className="h-8 w-8 text-[#CDA7B2]" />,
      title: "Stop Following Someone Else's Playbook",
      description: "You do not have to produce 300 pieces just because that is what the industry tells you. Discover what approach actually fits your brand."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-[#CDA7B2]" />,
      title: "Market With Confidence",
      description: "When you understand your design philosophy, you can position your brand authentically—whether that is luxury atelier or accessible fashion."
    }
  ];

  const archetypePreview = [
    { name: "The Muse Chaser", emoji: "✨", desc: "You design for her—a specific woman who lives in your imagination." },
    { name: "The World Builder", emoji: "🌙", desc: "You are creating a universe, not just clothes." },
    { name: "The Intimist", emoji: "🤍", desc: "You cultivate deep relationships with a devoted client base." },
    { name: "The Editor", emoji: "✂️", desc: "Every piece must justify its presence. Less, but exceptional." },
    { name: "The Populist", emoji: "🌍", desc: "Exceptional design should not be gatekept." }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#f5f0ea] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-[#CDA7B2]/10 px-6 py-2 rounded-full mb-6">
            <span className="text-[#CDA7B2] font-medium text-sm tracking-wide">Free 2-Minute Quiz</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
            What Kind of Designer Are You?
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed max-w-2xl mx-auto mb-8">
            Discover your Designer Archetype and finally understand why some production strategies
            feel natural while others drain your creative energy.
          </p>
          <Link href="/quiz">
            <Button
              size="lg"
              className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-16 px-12 text-xl font-light group"
            >
              Start the Quiz
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Take This Quiz */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3B3937] mb-4">
              Why This Quiz Matters
            </h2>
            <p className="text-lg text-[#967F71] font-light max-w-2xl mx-auto">
              The way you design shapes the way you should produce.<br />
              Understanding your creative archetype helps you build a fashion business<br />
              that feels aligned—not exhausting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#faf8f5] to-white p-8 rounded-xl border border-[#967F71]/10 text-center"
              >
                <div className="flex justify-center mb-4">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-serif font-light text-[#3B3937] mb-3">
                  {reason.title}
                </h3>
                <p className="text-[#967F71] font-light leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Reality Section */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3B3937] mb-6">
              Here is the Truth
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-10 shadow-lg border border-[#967F71]/10">
            <p className="text-xl text-[#967F71] font-light leading-relaxed mb-6">
              You do not have to position yourself as mass fashion if that is not your vision.
              Whether you are building a luxury company with 50 devoted clients or scaling a collection
              that reaches thousands, your production strategy should match your design philosophy, not someone else's.
            </p>
            <p className="text-xl text-[#967F71] font-light leading-relaxed mb-6">
              This quiz helps you discover which approach is right for you so you can stop second-guessing
              and start building with clarity.
            </p>
            <p className="text-lg text-[#3B3937] font-light leading-relaxed italic">
              This is not the be-all-end-all but is another way to approach the design process.
            </p>
          </div>
        </div>
      </section>

      {/* Archetype Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3B3937] mb-4">
              The Five Designer Archetypes
            </h2>
            <p className="text-lg text-[#967F71] font-light">
              Which one are you? Take the quiz to find out.
            </p>
          </div>

          <div className="space-y-4">
            {archetypePreview.map((arch, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-[#faf8f5] p-5 rounded-xl border border-[#967F71]/10"
              >
                <span className="text-3xl">{arch.emoji}</span>
                <div>
                  <h3 className="text-lg font-serif text-[#3B3937]">{arch.name}</h3>
                  <p className="text-[#967F71] font-light text-sm">{arch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5f0ea]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3B3937] mb-6">
            Ready to Discover Your Archetype?
          </h2>
          <p className="text-lg text-[#967F71] font-light mb-10">
            Answer 8 questions about how you design, and we will reveal your Designer Archetype—plus
            insights on how to align your production and marketing with who you actually are.
          </p>
          <Link href="/quiz">
            <Button
              size="lg"
              className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-16 px-12 text-xl font-light group"
            >
              Take the Quiz Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-sm text-[#967F71] mt-4 font-light">
            Takes about 2 minutes • No email required
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
