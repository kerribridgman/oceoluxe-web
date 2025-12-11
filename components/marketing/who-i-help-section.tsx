import { Sparkles, Factory, TrendingUp } from 'lucide-react';

export function WhoIHelpSection() {
  const stages = [
    {
      icon: <Sparkles className="h-6 w-6 text-[#CDA7B2]" />,
      title: "Just Starting Out",
      description: "You have sketches, samples, or a vision — but production feels like a foreign language.",
      challenges: [
        "Don't know where to find a factory or what to look for",
        "Unsure how to create tech packs or what to include",
        "Need help understanding industry timelines and minimums"
      ]
    },
    {
      icon: <Factory className="h-6 w-6 text-[#CDA7B2]" />,
      title: "In Production",
      description: "You have a factory, but something isn't clicking the way you expected.",
      challenges: [
        "Communication feels unclear — things get lost in translation",
        "Not sure what the factory handles vs. what you need to provide",
        "Delays keep happening and you're not sure if they're normal"
      ]
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#CDA7B2]" />,
      title: "Ready to Scale",
      description: "Production is working, but you need better systems to grow without burning out.",
      challenges: [
        "Struggling to keep track of multiple suppliers and samples",
        "Need backup factories in case your main one can't deliver",
        "Want to streamline processes so you can focus on designing"
      ]
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
            Wherever You Are in Your Journey
          </h2>
          <p className="text-xl text-[#967F71] leading-relaxed font-light">
            Whether you're searching for your first factory or scaling an existing line, I meet you where you are.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stages.map((stage, index) => (
            <div
              key={index}
              className="bg-[#faf8f5] p-8 rounded-2xl border border-[#EDEBE8] hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#CDA7B2]/10 w-12 h-12 rounded-full flex items-center justify-center">
                  {stage.icon}
                </div>
                <h3 className="text-xl font-serif font-light text-[#3B3937]">
                  {stage.title}
                </h3>
              </div>
              <p className="text-[#967F71] font-light mb-6">
                {stage.description}
              </p>
              <ul className="space-y-3">
                {stage.challenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#6B655C] font-light">
                    <span className="text-[#CDA7B2] mt-1">•</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center mt-16">
          <p className="text-lg text-[#967F71] font-light italic">
            "The confusion you're feeling isn't because you're doing something wrong — it's because no one taught you how manufacturing actually works."
          </p>
        </div>
      </div>
    </section>
  );
}
