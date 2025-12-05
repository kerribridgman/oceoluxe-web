'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Check,
  Target,
  Sparkles,
  CheckCircle,
  Clock,
  Heart,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { signOut } from '@/app/(login)/actions';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const experiences = [
  {
    icon: Target,
    title: 'Follow a proven flow',
    description: 'that takes your ideas from vision to production so you stop guessing and start seeing your designs come to life.',
  },
  {
    icon: Sparkles,
    title: 'Streamline communication with suppliers',
    description: 'using done-for-you templates so you stop stressing about being ignored and start building reliable partnerships.',
  },
  {
    icon: CheckCircle,
    title: 'Master your pricing + timelines',
    description: 'so you stop overspending and start protecting your margins like a pro.',
  },
  {
    icon: Clock,
    title: 'Save hours every week',
    description: 'with ready-to-go systems so you stop wasting energy on chaos and start creating with clarity.',
  },
  {
    icon: Heart,
    title: 'Feel supported instead of scattered',
    description: 'with a community that gets it — because building a fashion brand shouldn\'t feel so isolating.',
  },
];

const plans = [
  {
    name: 'Monthly',
    price: 33,
    interval: 'month',
    description: 'Founding member pricing',
    priceId: 'price_monthly',
    planKey: 'monthly',
    popular: false,
    bonus: null,
  },
  {
    name: 'Yearly',
    price: 297,
    interval: 'year',
    description: 'Save over 25%',
    priceId: 'price_yearly',
    planKey: 'yearly',
    popular: true,
    bonus: '5 hours of Expert Production Guidance',
  },
];

export default function SubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string>('price_yearly');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in
  const { data: user } = useSWR('/api/user', fetcher);
  const isLoggedIn = !!user && !user.error;

  // Check URL params for plan selection (e.g., from redirect)
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'monthly') {
      setSelectedPlan('price_monthly');
    } else if (planParam === 'yearly') {
      setSelectedPlan('price_yearly');
    }
  }, [searchParams]);

  async function handleSubscribe() {
    setIsLoading(true);

    // If not logged in, redirect to join page with selected plan
    if (!isLoggedIn) {
      const plan = plans.find((p) => p.priceId === selectedPlan);
      router.push(`/studio-join?plan=${plan?.planKey || 'yearly'}`);
      return;
    }

    // If logged in, create checkout session
    try {
      const res = await fetch('/api/studio/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: selectedPlan }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error('Checkout error:', data.error);
        alert('Failed to create checkout. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const selectedPlanData = plans.find((p) => p.priceId === selectedPlan);

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      {/* Header */}
      <div className="bg-[#FAF8F6] py-4 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CDA7B2] flex items-center justify-center">
              <span className="text-[#3B3937] font-bold text-lg">OL</span>
            </div>
            <div>
              <h1 className="text-lg font-serif font-light text-[#3B3937]">Studio Systems</h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                <span className="text-sm text-[#967F71] font-light">
                  {user.name || user.email}
                </span>
                <form action={async () => {
                  await signOut();
                  mutate('/api/user');
                  window.location.href = '/studio/subscribe';
                }}>
                  <button
                    type="submit"
                    className="text-sm text-[#3B3937] hover:text-[#CDA7B2] font-light transition-colors"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/studio-login"
                className="text-sm text-[#967F71] hover:text-[#3B3937] font-light"
              >
                Already a member? Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#FAF8F6] pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#3B3937] leading-tight mb-6">
              The Membership<br />
              That Gives Designers<br />
              & Visionaries<br />
              <span className="text-[#CDA7B2]">Structure as Support</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg">
              Stop spinning in overwhelm and finally bring your ideas to life with systems that feel like luxury.
            </p>

            {/* Elegant Plan Selection Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-md">
              <p className="text-xs uppercase tracking-widest text-[#967F71] mb-4 font-medium">Select Your Plan</p>

              <div className="space-y-3 mb-6">
                {plans.map((plan) => (
                  <button
                    key={plan.priceId}
                    onClick={() => setSelectedPlan(plan.priceId)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      selectedPlan === plan.priceId
                        ? 'bg-[#FAF8F6] border-2 border-[#CDA7B2]'
                        : 'bg-[#FAF8F6] border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.priceId
                          ? 'border-[#CDA7B2]'
                          : 'border-gray-300'
                      }`}>
                        {selectedPlan === plan.priceId && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#CDA7B2]" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-[#3B3937]">{plan.name}</span>
                        {plan.popular && (
                          <span className="ml-2 text-xs text-[#CDA7B2] font-medium">Best Value</span>
                        )}
                        {plan.bonus && (
                          <p className="text-xs text-[#967F71] mt-0.5">+ {plan.bonus}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-serif text-[#3B3937]">${plan.price}</span>
                      <span className="text-sm text-[#967F71]">/{plan.interval}</span>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-[#3B3937] hover:bg-[#4A4745] text-white py-6 text-base font-medium rounded-xl"
              >
                {isLoading ? 'Processing...' : "Yes, I'm In — Join Now"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-center text-xs text-[#967F71] mt-4">Cancel anytime. No questions asked.</p>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <img
                src="/images/hero-workspace.jpg"
                alt="Fashion designer workspace with laptop and fabric swatches"
                className="rounded-2xl w-full aspect-[4/3] object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Experience Section */}
      <div className="bg-[#FAF8F6] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-[#3B3937] text-center mb-16">
            What You'll Experience Inside Oceo Luxe
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {experiences.slice(0, 4).map((exp) => (
              <div
                key={exp.title}
                className="bg-[#F5F0EB] rounded-xl p-8 border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full bg-[#CDA7B2]/15 flex items-center justify-center mb-5">
                  <exp.icon className="w-6 h-6 text-[#CDA7B2]" />
                </div>
                <h3 className="font-semibold text-[#3B3937] text-lg mb-2">{exp.title}</h3>
                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>

          {/* Centered 5th card */}
          <div className="max-w-lg mx-auto">
            <div className="bg-[#F5F0EB] rounded-xl p-8 border border-gray-100 text-center">
              <div className="w-12 h-12 rounded-full bg-[#CDA7B2]/15 flex items-center justify-center mb-5 mx-auto">
                <Heart className="w-6 h-6 text-[#CDA7B2]" />
              </div>
              <h3 className="font-semibold text-[#3B3937] text-lg mb-2">{experiences[4].title}</h3>
              <p className="text-gray-600 leading-relaxed">{experiences[4].description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-[#FAF8F6] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#3B3937] mb-4">
            A Luxury-Level Membership for<br />
            the Price of Coffee & Croissant
          </h2>

          <p className="text-gray-500 line-through text-lg mb-2 mt-8">
            Normal Price: $111/month
          </p>

          <div className="mb-2">
            <span className="text-6xl md:text-7xl font-serif text-[#8B7355]">
              <span className="text-4xl align-top">$</span>
              {selectedPlanData?.price === 297 ? '297' : '33'}
            </span>
            <span className="text-2xl text-[#8B7355] font-serif">/{selectedPlanData?.interval}</span>
          </div>

          <p className="text-gray-500 mb-8">(no strings attached, cancel anytime)</p>

          {/* Plan Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            {plans.map((plan) => (
              <button
                key={plan.priceId}
                onClick={() => setSelectedPlan(plan.priceId)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedPlan === plan.priceId
                    ? 'bg-[#3B3937] text-white'
                    : 'bg-white text-[#3B3937] border border-gray-200 hover:border-[#CDA7B2]'
                }`}
              >
                {plan.name}
                {plan.popular && (
                  <span className="ml-2 text-xs bg-[#CDA7B2] text-white px-2 py-0.5 rounded-full">
                    Best Value
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bonus for Annual */}
          {selectedPlanData?.bonus && (
            <div className="bg-gradient-to-r from-[#CDA7B2]/10 to-[#CDA7B2]/5 border border-[#CDA7B2]/30 rounded-xl p-4 mb-8 inline-block">
              <p className="text-[#8B7355] font-medium">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Annual Bonus: {selectedPlanData.bonus}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              size="lg"
              className="bg-[#3B3937] hover:bg-[#4A4745] text-white px-12 py-7 text-lg font-medium rounded-lg w-full max-w-md"
            >
              {isLoading ? 'Processing...' : "Yes, I'm In — Join Now"}
            </Button>

            <button className="text-gray-400 hover:text-gray-600 text-sm block mx-auto">
              No thanks, I'll figure it out on my own
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#FAF8F6] py-8 px-6 border-t border-gray-100">
        <p className="text-center text-gray-400 text-sm">
          &copy; 2025 Oceo Luxe. All rights reserved.
        </p>
      </div>
    </div>
  );
}
