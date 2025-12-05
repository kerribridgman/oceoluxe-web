'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Check,
  BookOpen,
  Users,
  FolderOpen,
  Trophy,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Full Course Library',
    description: 'Access all courses and lessons with step-by-step guidance',
  },
  {
    icon: FolderOpen,
    title: 'Resource Templates',
    description: 'Download templates, guides, and tools for your business',
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Connect with fellow members and get support',
  },
  {
    icon: Trophy,
    title: 'Gamification & Rewards',
    description: 'Earn points, track progress, and climb the leaderboard',
  },
];

const plans = [
  {
    name: 'Monthly',
    price: 33,
    interval: 'month',
    description: 'Founding member pricing',
    priceId: 'price_monthly', // Replace with actual Stripe price ID
    popular: false,
  },
  {
    name: 'Yearly',
    price: 297,
    interval: 'year',
    description: 'Save over 25%',
    priceId: 'price_yearly', // Replace with actual Stripe price ID
    popular: true,
  },
];

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('price_yearly');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubscribe() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/studio/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: selectedPlan }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Header */}
      <div className="bg-[#3B3937] text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CDA7B2] flex items-center justify-center shadow-lg">
              <span className="text-[#3B3937] font-bold text-lg">OL</span>
            </div>
            <div>
              <h1 className="text-lg font-serif font-light">Studio Systems</h1>
            </div>
          </Link>
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#CDA7B2]/10 text-[#CDA7B2] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Founding Member Pricing
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-4">
            Join Studio Systems
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get access to our complete library of courses, templates, and a
            supportive community of fashion business professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-[#CDA7B2]/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#CDA7B2]" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.priceId}
                className={`relative cursor-pointer transition-all ${
                  selectedPlan === plan.priceId
                    ? 'border-2 border-[#CDA7B2] shadow-lg'
                    : 'border-0 shadow-sm hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(plan.priceId)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#CDA7B2] text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500">/{plan.interval}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center ${
                      selectedPlan === plan.priceId
                        ? 'border-[#CDA7B2] bg-[#CDA7B2]'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedPlan === plan.priceId && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              size="lg"
              className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90 text-white px-8 py-6 text-lg"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Everything Included
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              'Full access to all courses',
              'New courses added monthly',
              'Downloadable templates & resources',
              'Private community access',
              'Progress tracking & certificates',
              'Points & leaderboard system',
              'Email support',
              'Mobile-friendly experience',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
