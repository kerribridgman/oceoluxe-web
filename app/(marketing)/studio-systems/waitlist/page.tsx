'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Heart,
  ArrowLeft,
  Loader2,
  Check,
  Video,
  LayoutGrid,
  Users,
  ArrowRight,
  Lock,
} from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const experiences = [
  {
    icon: Video,
    title: 'Twice-Monthly Live Q&A Calls',
    description: 'Direct access to real-time support so you can pressure-test decisions, get unstuck fast, and move your production forward with accuracy instead of second-guessing.',
  },
  {
    icon: LayoutGrid,
    title: 'A Complete Notion System for Your Brand',
    description: 'Instant access to done-for-you Notion templates covering production, distribution, marketing, sales, and launches... so you\'re not building systems from scratch or keeping everything in your head.',
  },
  {
    icon: Users,
    title: 'A Private Designer Community',
    description: 'Ask questions, share wins, and get perspective from designers navigating the same stage of business. Think: supplier insider information, real-time feedback, and people who get it.',
  },
  {
    icon: Heart,
    title: 'Leadership, Mindset & Somatic Support',
    description: 'Regulated leaders build sustainable brands... Enjoy practical tools to help you stay grounded and decisive, including yoga flows, body scans, and nervous-system regulation practices designed for creative founders managing real pressure.',
  },
];

export default function WaitlistPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);

  // Check if user is logged in
  const { data: user } = useSWR('/api/user', fetcher);
  const isLoggedIn = !!user && !user.error;

  async function handleCheckout() {
    setIsCheckingOut(true);
    setError(null);

    // If not logged in, redirect to join page
    if (!isLoggedIn) {
      router.push('/studio-join?plan=monthly&founding=true');
      return;
    }

    // If logged in, create checkout session
    try {
      const res = await fetch('/api/studio/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_monthly' }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error('Checkout error:', data.error);
        setError('Failed to create checkout. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  }

  async function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Oceo Luxe</span>
          </Link>
          <div className="text-lg font-semibold text-[#3B3937]">Studio Systems</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Value Props */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#3B3937] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Lock className="w-4 h-4" />
              Founding Member Access Open
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#3B3937] mb-6 leading-tight">
              Join the waitlist for the industry-essential fashion design membership that finally turns sketches into production.
            </h1>

            <p className="text-sm font-semibold text-[#CDA7B2] uppercase tracking-wide mb-2">
              For Founding Members Only…
            </p>
            <p className="text-lg text-gray-600 mb-10">
              <strong>Lock in a 50% monthly discount</strong> and get the membership for less than what I typically charge for just five minutes of my 1:1 time.
            </p>

            {/* What You'll Get */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#3B3937]">
                Inside Studio Systems, you'll get:
              </h2>

              {experiences.map((exp, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#CDA7B2]/10 flex items-center justify-center">
                    <exp.icon className="w-5 h-5 text-[#CDA7B2]" />
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium text-[#3B3937]">{exp.title}</span>{' '}
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Checkout/Form */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#3B3937] mb-3">
                    You're on the list!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for joining the waitlist. We'll be in touch soon with exclusive
                    updates and early access details.
                  </p>
                  <Link href="/">
                    <Button variant="outline">
                      Return to Oceo Luxe
                    </Button>
                  </Link>
                </div>
              ) : showWaitlistForm ? (
                <>
                  <button
                    onClick={() => setShowWaitlistForm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back to checkout
                  </button>
                  <h2 className="text-2xl font-bold text-[#3B3937] mb-2">
                    Join the Waitlist
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Get notified when we launch. No payment required.
                  </p>

                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your first name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#3B3937] hover:bg-[#4A4745] text-white py-6 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        'Join the Waitlist'
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    By joining, you agree to receive updates about Studio Systems.
                    Unsubscribe anytime.
                  </p>
                </>
              ) : (
                <>
                  {/* Founding Member Checkout */}
                  <div className="text-center mb-6">
                    <p className="text-sm font-semibold text-[#CDA7B2] uppercase tracking-wide mb-1">
                      Founding Member Pricing
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-gray-400 line-through text-lg">$88</span>
                      <span className="text-5xl font-serif text-[#3B3937]">$55</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Lock in this rate forever
                    </p>
                  </div>

                  <div className="bg-[#FAF8F6] rounded-xl p-4 mb-6">
                    <p className="text-sm text-[#3B3937] font-medium mb-3">What you're getting:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#CDA7B2] mt-0.5 flex-shrink-0" />
                        <span>50% founding member discount (locked forever)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#CDA7B2] mt-0.5 flex-shrink-0" />
                        <span>Full access when we launch (coming very soon)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#CDA7B2] mt-0.5 flex-shrink-0" />
                        <span>Cancel anytime, no questions asked</span>
                      </li>
                    </ul>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                  )}

                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-[#CDA7B2] hover:bg-[#BD97A2] text-white py-6 text-lg mb-3"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Lock In My Spot
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mb-6">
                    Secure checkout powered by Stripe
                  </p>

                  <div className="border-t border-gray-100 pt-4">
                    <button
                      onClick={() => setShowWaitlistForm(true)}
                      className="w-full text-sm text-gray-500 hover:text-gray-700"
                    >
                      Not ready to commit? <span className="underline">Join the free waitlist instead</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Social Proof */}
            {!isSubmitted && !showWaitlistForm && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Join designers who are building brands with clarity
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
