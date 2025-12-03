'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

const questions = [
  {
    q: "Your ideal client walks into your studio. Who is she?",
    options: [
      { text: "A woman I've been envisioning for years -I understand her life intimately", arch: "muse" },
      { text: "Someone drawn to the universe I'm creating, not just the clothes", arch: "world" },
      { text: "A loyal client who returns season after season, trusting me completely", arch: "intimate" },
      { text: "Someone who recognizes that every piece in my collection has purpose", arch: "editor" },
      { text: "Anyone who genuinely connects with my work -I want my designs to find their people", arch: "populist" }
    ]
  },
  {
    q: "A respected boutique wants to carry your line, but asks for more accessible pieces. How do you respond?",
    options: [
      { text: "I gracefully decline -shifting the vision would confuse the woman I design for", arch: "muse" },
      { text: "I explain that the world I've created requires a certain commitment", arch: "world" },
      { text: "I prefer to work directly with clients I know personally", arch: "intimate" },
      { text: "I'd consider it, but only if I could maintain the integrity of the collection", arch: "editor" },
      { text: "I'm intrigued -this could introduce my work to a wider audience", arch: "populist" }
    ]
  },
  {
    q: "How do you approach production quantities?",
    options: [
      { text: "I consider how many women truly embody the spirit of each piece", arch: "muse" },
      { text: "I let the narrative of the season guide those decisions", arch: "world" },
      { text: "I produce primarily to order, with a limited number of additional pieces", arch: "intimate" },
      { text: "I keep numbers intentionally tight -I'd rather sell through than carry excess", arch: "editor" },
      { text: "I think carefully about demand and try to meet my audience where they are", arch: "populist" }
    ]
  },
  {
    q: "What outcome would disappoint you most?",
    options: [
      { text: "Seeing my work on someone who doesn't understand its intention", arch: "muse" },
      { text: "Watching my brand become indistinguishable from others", arch: "world" },
      { text: "Losing the intimate connection with the women who wear my clothes", arch: "intimate" },
      { text: "A collection that feels diluted or unfocused", arch: "editor" },
      { text: "Creating meaningful work that never finds its audience", arch: "populist" }
    ]
  },
  {
    q: "A prominent figure requests to wear your piece to a major event -as a gift. Your thoughts?",
    options: [
      { text: "Only if she genuinely embodies my muse -visibility alone isn't enough", arch: "muse" },
      { text: "If she can authentically represent the world I'm building, yes", arch: "world" },
      { text: "I'm more inclined to dress the loyal clients who've supported me", arch: "intimate" },
      { text: "I'd weigh whether it aligns with my broader strategy", arch: "editor" },
      { text: "The opportunity to introduce my work to new audiences is compelling", arch: "populist" }
    ]
  },
  {
    q: "Which moment in the design process brings you the most satisfaction?",
    options: [
      { text: "Envisioning precisely how she'll feel the moment she puts it on", arch: "muse" },
      { text: "Developing the concept -the mood, the references, the complete vision", arch: "world" },
      { text: "The fitting, when I see it come to life on someone I know", arch: "intimate" },
      { text: "The editing process, refining until only the essential remains", arch: "editor" },
      { text: "Knowing this piece will exist in the world and find its rightful owner", arch: "populist" }
    ]
  },
  {
    q: "How do you want women to feel when they wear your designs?",
    options: [
      { text: "As though I created it with only her in mind", arch: "muse" },
      { text: "As though they've entered something larger than fashion", arch: "world" },
      { text: "As though they belong to something rare and considered", arch: "intimate" },
      { text: "As though they're wearing intention, not simply fabric", arch: "editor" },
      { text: "As though exceptional design found them, rather than the reverse", arch: "populist" }
    ]
  },
  {
    q: "When you envision your brand in five years, what does success look like?",
    options: [
      { text: "A devoted following of women who see themselves reflected in everything I create", arch: "muse" },
      { text: "A brand that's become a recognized world -unmistakable at first glance", arch: "world" },
      { text: "An intimate client list, most of whom I know personally", arch: "intimate" },
      { text: "A refined, respected collection where nothing is extraneous", arch: "editor" },
      { text: "My designs reaching more women without compromising what makes them distinctive", arch: "populist" }
    ]
  }
];

type ArchetypeKey = 'muse' | 'world' | 'intimate' | 'editor' | 'populist';

const archetypes: Record<ArchetypeKey, {
  title: string;
  emoji: string;
  description: string;
  superpower: string;
  blindspot: string;
  cta: string;
}> = {
  muse: {
    title: "The Muse Chaser",
    emoji: "✨",
    description: "You design for her. There is a woman who lives in your imagination -perhaps an amalgam of women you've encountered, perhaps the woman you aspire to be, perhaps entirely invented. Every decision passes through a single filter: would she wear this?",
    superpower: "Your clarity of vision is unwavering. While others follow trends, you are composing a wardrobe for someone specific. That focus imbues your work with genuine soul.",
    blindspot: "Your muse may be keeping your audience more narrow than necessary. Not every client needs to be her precisely -some simply wish to inhabit her energy for an evening.",
    cta: "Discover how to expand your reach while honoring your muse"
  },
  world: {
    title: "The World Builder",
    emoji: "🌙",
    description: "You are not simply making clothes -you are creating a universe. Your brand possesses a mood, a mythology, an entire aesthetic ecosystem. Clients are not purchasing a garment; they are stepping into the world you've constructed.",
    superpower: "You generate desire that transcends the garment itself. Women want to inhabit your brand, not merely wear it. That is rare and remarkably powerful.",
    blindspot: "At times, your world becomes so intricate that clients struggle to find the entrance. Ensure there is a door -not simply a window through which to observe.",
    cta: "Learn how to welcome clients into your world"
  },
  intimate: {
    title: "The Intimist",
    emoji: "🤍",
    description: "You would rather cultivate fifty devoted clients than five hundred casual ones. Your vision includes a by-appointment atelier, made-to-order pieces, and relationships that extend across years. For you, fashion is personal -nearly private.",
    superpower: "Your clients demonstrate loyalty that mass brands will never achieve. You are not competing on price or trends -you are irreplaceable because you truly know them.",
    blindspot: "Intimacy can become a limitation. Growth is not a betrayal -it is possible to scale thoughtfully while preserving the relationships that matter most.",
    cta: "Explore how to grow while maintaining intimacy"
  },
  editor: {
    title: "The Editor",
    emoji: "✂️",
    description: "You believe in less, but exceptional. Every piece in your collection must justify its presence. You would rather delay a launch than release something that falls short of your standard. Filler has no place in your vocabulary.",
    superpower: "Your collections are focused, intentional, and respected. Buyers and clients trust that if you've made it, it matters.",
    blindspot: "Editing can become paralysis. Sometimes releasing work that is ready, rather than perfect, is the wiser choice. The world needs what you create -don't let perfection delay its arrival.",
    cta: "Learn to balance refinement with momentum"
  },
  populist: {
    title: "The Populist",
    emoji: "🌍",
    description: "You want your designs to reach women. Not in a mass-market sense -but you genuinely believe exceptional design should not be gatekept. Accessibility is integral to your vision, not a compromise of it.",
    superpower: "You consider your client's reality -her life, her needs, her access. That makes your work wearable in the truest sense of the word.",
    blindspot: "Be careful not to underestimate the power of exclusivity. Scarcity can create desire, and desire creates value. You can serve more women without being available to everyone.",
    cta: "Discover how to balance accessibility with exclusivity"
  }
};

export default function DesignerQuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<ArchetypeKey, number>>({
    muse: 0, world: 0, intimate: 0, editor: 0, populist: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (arch: ArchetypeKey) => {
    setSelectedAnswer(arch);
    setTimeout(() => {
      const newScores = { ...scores, [arch]: scores[arch] + 1 };
      setScores(newScores);

      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 300);
  };

  const getResult = () => {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return archetypes[sorted[0][0] as ArchetypeKey];
  };

  const restart = () => {
    setCurrentQ(0);
    setScores({ muse: 0, world: 0, intimate: 0, editor: 0, populist: 0 });
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const progress = ((currentQ + 1) / questions.length) * 100;

  if (showResult) {
    const result = getResult();
    return (
      <div className="min-h-screen bg-[#f4f4f4]">
        <MarketingHeader />

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-[#967f71] text-xs tracking-[3px] mb-2 uppercase">Your Result</p>
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h1 className="text-4xl font-serif font-light text-[#3b3937] mb-6 italic">
            You are {result.title}
          </h1>

          <div className="bg-white rounded-2xl p-8 text-left mb-6 shadow-lg">
            <p className="text-[#3b3937] leading-relaxed mb-6">
              {result.description}
            </p>

            <div className="mb-5">
              <h3 className="text-[#cda7b2] text-xs tracking-[2px] mb-2 uppercase">Your Strength</h3>
              <p className="text-[#967f71] leading-relaxed text-[15px]">{result.superpower}</p>
            </div>

            <div>
              <h3 className="text-[#cda7b2] text-xs tracking-[2px] mb-2 uppercase">Your Opportunity</h3>
              <p className="text-[#967f71] leading-relaxed text-[15px]">{result.blindspot}</p>
            </div>
          </div>

          <Link href="/studio-systems">
            <button className="w-full bg-[#3b3937] text-[#f4f4f4] border-none py-4 px-8 rounded-full text-[15px] cursor-pointer mb-4 font-serif transition-all hover:bg-[#967f71] flex items-center justify-center gap-2 group">
              {result.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <button
            onClick={restart}
            className="bg-transparent text-[#967f71] border border-[#967f71] py-3 px-6 rounded-full text-sm cursor-pointer font-serif transition-all hover:bg-[#967f71] hover:text-[#f4f4f4]"
          >
            Retake the quiz
          </button>
        </div>

        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <MarketingHeader />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-[#967f71] text-xs tracking-[3px] mb-2 uppercase">Oceo Luxe Presents</p>
          <h1 className="text-[#3b3937] text-3xl font-serif font-light italic mb-2">
            What Kind of Designer Are You?
          </h1>
          <p className="text-[#967f71] text-sm">
            Discover how you connect with your clients and craft your collections
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#e8e4e1] rounded-full h-1.5 mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#cda7b2] to-[#967f71] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[#967f71] text-sm text-center mb-4">
          {currentQ + 1} of {questions.length}
        </p>

        <h2 className="text-[#3b3937] text-xl font-serif font-light text-center mb-8 leading-relaxed">
          {questions[currentQ].q}
        </h2>

        <div className="flex flex-col gap-3">
          {questions[currentQ].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.arch as ArchetypeKey)}
              className={`
                text-left p-5 rounded-xl border transition-all duration-200 font-serif text-[15px] leading-relaxed
                ${selectedAnswer === opt.arch
                  ? 'bg-[#3b3937] border-[#3b3937] text-[#f4f4f4]'
                  : 'bg-white border-[#e8e4e1] text-[#3b3937] hover:border-[#cda7b2] hover:shadow-md'
                }
              `}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
