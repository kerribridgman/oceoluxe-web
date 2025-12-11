import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock, MessageSquare, FileText, Building2, Handshake } from 'lucide-react';

export function FactoryTruthsSection() {
  const factoryTruths = [
    {
      icon: <FileText className="h-6 w-6 text-[#CDA7B2]" />,
      title: "Complete specs upfront save you money",
      description: "Providing detailed tech packs, patterns, and fabric decisions before production prevents expensive back-and-forth and disputes later."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-[#CDA7B2]" />,
      title: "Your email contact may not be your maker",
      description: "The person answering your emails might not be the one sewing your samples. Understanding the factory's workflow helps you communicate to the right people."
    },
    {
      icon: <Clock className="h-6 w-6 text-[#CDA7B2]" />,
      title: "Industry timelines are longer than you think",
      description: "Most production runs start a year in advance. Add in Chinese New Year closures and holiday rush, and timing becomes everything."
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-[#CDA7B2]" />,
      title: "That delay might actually be normal",
      description: "What feels like a factory problem is often just how manufacturing works. Understanding typical timelines prevents unnecessary frustration."
    },
    {
      icon: <Building2 className="h-6 w-6 text-[#CDA7B2]" />,
      title: "One factory is never enough",
      description: "Even great relationships can fall through. Having backup factories vetted and ready protects your business when things go sideways."
    },
    {
      icon: <Handshake className="h-6 w-6 text-[#CDA7B2]" />,
      title: "Factories prioritize trusted relationships",
      description: "They give the best attention to designers they know and trust. Building that relationship takes time, visits, and clear communication."
    }
  ];

  return (
    <section className="py-24 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
            What I Wish Someone Had Told Me
          </h2>
          <p className="text-xl text-[#967F71] leading-relaxed font-light">
            After years of working in luxury production, these are the truths that would have saved me (and my clients) countless headaches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factoryTruths.map((truth, index) => (
            <Card key={index} className="border-[#EDEBE8] bg-white hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#CDA7B2]/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    {truth.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#3B3937] mb-2">
                      {truth.title}
                    </h3>
                    <p className="text-[#6B655C] font-light leading-relaxed text-sm">
                      {truth.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-[#967F71] font-light">
            This is what I teach, so you don't have to learn it the hard way.
          </p>
        </div>
      </div>
    </section>
  );
}
