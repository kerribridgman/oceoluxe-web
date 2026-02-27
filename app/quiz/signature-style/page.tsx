'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, X, Loader2 } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

const questions = [
  {
    q: "A structured jacket with a nipped waist, rounded shoulders, and a full skirt that revolutionized women's fashion in 1947. Known as \"The New Look.\"",
    options: [
      { text: "Chanel", correct: false },
      { text: "Dior", correct: true },
      { text: "Balenciaga", correct: false },
      { text: "Yves Saint Laurent", correct: false },
    ],
    correctAnswer: "Dior",
    explanation: "Christian Dior introduced \"The New Look\" in 1947, featuring nipped waists and full skirts that marked a dramatic departure from wartime austerity fashion."
  },
  {
    q: "Quilted leather handbags with chain-link straps, often featuring a double-C logo clasp.",
    options: [
      { text: "Hermès", correct: false },
      { text: "Gucci", correct: false },
      { text: "Chanel", correct: true },
      { text: "Louis Vuitton", correct: false },
    ],
    correctAnswer: "Chanel",
    explanation: "The iconic Chanel 2.55 bag, named for its February 1955 release date, introduced the quilted leather and chain strap design that remains synonymous with the house."
  },
  {
    q: "Red lacquered soles on high-heeled shoes.",
    options: [
      { text: "Manolo Blahnik", correct: false },
      { text: "Jimmy Choo", correct: false },
      { text: "Christian Louboutin", correct: true },
      { text: "Salvatore Ferragamo", correct: false },
    ],
    correctAnswer: "Christian Louboutin",
    explanation: "Christian Louboutin's red lacquered soles became his trademark in 1993 when he painted red nail polish on a prototype sole. The red sole is now legally trademarked."
  },
  {
    q: "Beige, black, red, and white check pattern, most famously seen on trench coats and scarves.",
    options: [
      { text: "Aquascutum", correct: false },
      { text: "Burberry", correct: true },
      { text: "Barbour", correct: false },
      { text: "Mackintosh", correct: false },
    ],
    correctAnswer: "Burberry",
    explanation: "The Burberry check pattern was created in the 1920s as a trench coat lining. It became so iconic that it was registered as a trademark in 1924."
  },
  {
    q: "Dramatic skull motifs, romantic tailoring mixed with raw edge finishes, and theatrical runway shows.",
    options: [
      { text: "Rick Owens", correct: false },
      { text: "Alexander McQueen", correct: true },
      { text: "Gareth Pugh", correct: false },
      { text: "Ann Demeulemeester", correct: false },
    ],
    correctAnswer: "Alexander McQueen",
    explanation: "Alexander McQueen was known for his skull scarves, dramatic tailoring, and legendary theatrical shows that pushed the boundaries of fashion as art."
  },
];

type QuizState = 'email_capture' | 'questions' | 'result';

export default function SignatureStyleQuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>('email_capture');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [proofToken] = useState(() => {
    const t = Date.now();
    return { _t: t, _proof: btoa(String(t).split('').reverse().join('') + 'luxe' + String(t % 9973)) };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleAnswer = (index: number) => {
    if (showFeedback) return; // Prevent multiple clicks

    setSelectedAnswer(index);
    setShowFeedback(true);

    const isCorrect = questions[currentQ].options[index].correct;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(newScore);
    }

    setTimeout(async () => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Quiz complete - send results email before showing results
        try {
          await fetch('/api/quiz/signature-style/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              name,
              score: newScore,
              totalQuestions: questions.length,
            }),
          });
        } catch (error) {
          console.error('Failed to send results email:', error);
        }
        setQuizState('result');
      }
    }, 2000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/quiz/signature-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          sendEmail: false, // Don't send email yet - wait for results
          _honeypot: honeypot,
          _t: proofToken._t,
          _proof: proofToken._proof,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save your information');
      }

      setQuizState('questions');
    } catch (error) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setScore(0);
    setQuizState('email_capture');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setEmail('');
    setName('');
    setSubmitError('');
  };

  const progress = ((currentQ + 1) / questions.length) * 100;

  const getResultMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) {
      return {
        emoji: "👑",
        title: "Fashion Connoisseur!",
        description: "Perfect score! You have an encyclopedic knowledge of fashion history and iconic design signatures."
      };
    } else if (percentage >= 80) {
      return {
        emoji: "✨",
        title: "Style Expert!",
        description: "Impressive! Your knowledge of fashion's most iconic signatures is nearly flawless."
      };
    } else if (percentage >= 60) {
      return {
        emoji: "🌟",
        title: "Fashion Enthusiast!",
        description: "Well done! You clearly have a strong appreciation for fashion history and design."
      };
    } else if (percentage >= 40) {
      return {
        emoji: "💫",
        title: "Emerging Connoisseur!",
        description: "Not bad! You know your fashion basics, with room to explore more iconic design signatures."
      };
    } else {
      return {
        emoji: "🌱",
        title: "Fashion Curious!",
        description: "Every expert starts somewhere! This quiz is a great beginning to exploring fashion's rich history."
      };
    }
  };

  // Email capture screen
  if (quizState === 'email_capture') {
    return (
      <div className="min-h-screen bg-[#f4f4f4]">
        <MarketingHeader />

        <div className="max-w-xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <p className="text-[#967f71] text-xs tracking-[3px] mb-2 uppercase">Oceo Luxe Presents</p>
            <h1 className="text-3xl font-serif font-light text-[#3b3937] mb-4 italic">
              Can You Identify the Signature Style?
            </h1>
            <p className="text-[#967f71] leading-relaxed">
              Test your knowledge of fashion's most iconic design signatures. Enter your email to start the quiz and see how you compare.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#3b3937] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e4e1] focus:border-[#cda7b2] focus:outline-none focus:ring-2 focus:ring-[#cda7b2]/20 transition-all text-[#3b3937]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3b3937] mb-2">
                  Email Address <span className="text-[#cda7b2]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e4e1] focus:border-[#cda7b2] focus:outline-none focus:ring-2 focus:ring-[#cda7b2]/20 transition-all text-[#3b3937]"
                />
              </div>

              {/* Honeypot field - visually hidden from users, bots auto-fill it */}
              <div className="absolute overflow-hidden" style={{ width: 0, height: 0, opacity: 0 }} aria-hidden="true">
                <label htmlFor="quiz-website">Website</label>
                <input
                  id="quiz-website"
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {submitError && (
                <p className="text-red-500 text-sm">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-[#3b3937] text-[#f4f4f4] border-none py-4 px-8 rounded-full text-[15px] cursor-pointer font-serif transition-all hover:bg-[#967f71] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Starting quiz...
                  </>
                ) : (
                  <>
                    Start the Quiz
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#967f71] text-center mt-4">
              We respect your inbox. Unsubscribe anytime.
            </p>
          </form>
        </div>

        <MarketingFooter />
      </div>
    );
  }

  // Result screen
  if (quizState === 'result') {
    const result = getResultMessage();

    return (
      <div className="min-h-screen bg-[#f4f4f4]">
        <MarketingHeader />

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-[#967f71] text-xs tracking-[3px] mb-2 uppercase">Your Result</p>
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h1 className="text-4xl font-serif font-light text-[#3b3937] mb-2 italic">
            {result.title}
          </h1>
          <p className="text-2xl font-serif text-[#cda7b2] mb-6">
            {score} out of {questions.length} correct
          </p>

          <div className="bg-white rounded-2xl p-8 text-left mb-6 shadow-lg">
            <p className="text-[#3b3937] leading-relaxed mb-6 text-center">
              {result.description}
            </p>

            <div className="border-t border-[#e8e4e1] pt-6">
              <h3 className="text-[#cda7b2] text-xs tracking-[2px] mb-4 uppercase text-center">
                Answer Key
              </h3>
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-[#967f71] font-medium min-w-[20px]">{i + 1}.</span>
                    <span className="text-[#3b3937]">{q.correctAnswer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/quiz">
            <button className="w-full bg-[#3b3937] text-[#f4f4f4] border-none py-4 px-8 rounded-full text-[15px] cursor-pointer mb-4 font-serif transition-all hover:bg-[#967f71] flex items-center justify-center gap-2 group">
              Take the Designer Archetype Quiz
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <button
            onClick={restart}
            className="bg-transparent text-[#967f71] border border-[#967f71] py-3 px-6 rounded-full text-sm cursor-pointer font-serif transition-all hover:bg-[#967f71] hover:text-[#f4f4f4]"
          >
            Try Again
          </button>
        </div>

        <MarketingFooter />
      </div>
    );
  }

  // Questions screen
  return (
    <div className="min-h-screen bg-[#f4f4f4] overflow-hidden">
      <MarketingHeader />

      <div className="max-w-2xl mx-auto px-4 py-16 relative">
        {/* Decorative circles */}
        <div
          className="absolute top-8 right-0 w-16 h-16 rounded-full bg-[#CDA7B2] opacity-20 animate-float hidden lg:block"
          aria-hidden="true"
        />
        <div
          className="absolute top-24 -left-12 w-12 h-12 rounded-full bg-[#967F71] opacity-15 animate-float-slow hidden lg:block"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/3 -right-8 w-8 h-8 rounded-full bg-[#CDA7B2] opacity-25 animate-float-delayed hidden lg:block"
          aria-hidden="true"
        />

        <div className="text-center mb-10">
          <p className="text-[#967f71] text-xs tracking-[3px] mb-2 uppercase animate-in fade-in slide-in-from-bottom-4 duration-500">Oceo Luxe Presents</p>
          <h1 className="text-[#3b3937] text-3xl font-serif font-light italic mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Can You Identify the Signature Style?
          </h1>
          <p className="text-[#967f71] text-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            Test your knowledge of fashion's most iconic design signatures
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
          {questions[currentQ].options.map((opt, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = opt.correct;

            let buttonClasses = 'text-left p-5 rounded-xl border transition-all duration-200 font-serif text-[15px] leading-relaxed flex items-center justify-between';

            if (showFeedback) {
              if (isCorrect) {
                buttonClasses += ' bg-green-50 border-green-500 text-green-800';
              } else if (isSelected && !isCorrect) {
                buttonClasses += ' bg-red-50 border-red-400 text-red-800';
              } else {
                buttonClasses += ' bg-white border-[#e8e4e1] text-[#967f71] opacity-50';
              }
            } else {
              buttonClasses += ' bg-white border-[#e8e4e1] text-[#3b3937] hover:border-[#cda7b2] hover:shadow-md cursor-pointer';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showFeedback}
                className={buttonClasses}
              >
                <span>{opt.text}</span>
                {showFeedback && isCorrect && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback explanation */}
        {showFeedback && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-[#e8e4e1] text-center">
            <p className="text-[#967f71] text-sm leading-relaxed">
              {questions[currentQ].explanation}
            </p>
          </div>
        )}
      </div>

      <MarketingFooter />
    </div>
  );
}
