'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Target,
  Sparkles,
  CheckCircle,
  Clock,
  Heart,
  ArrowLeft,
  Loader2,
  Check,
} from 'lucide-react';

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

export default function WaitlistPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
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
            <div className="inline-flex items-center gap-2 bg-[#CDA7B2]/10 text-[#CDA7B2] px-3 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Coming Soon
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#3B3937] mb-6 leading-tight">
              The Production + Operations Membership for Fashion Designers
            </h1>

            <p className="text-lg text-gray-600 mb-10">
              Stop spinning your wheels and start building a brand that actually works.
              Join the waitlist to be the first to know when we open doors.
            </p>

            {/* What You'll Get */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#3B3937]">
                Inside Studio Systems, you'll:
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

          {/* Right Column - Form */}
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
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#3B3937] mb-2">
                    Join the Waitlist
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Be the first to know when Studio Systems opens its doors.
                    Early birds get special founding member pricing.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
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
                      className="w-full bg-[#CDA7B2] hover:bg-[#CDA7B2]/90 text-white py-6 text-lg"
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
              )}
            </div>

            {/* Social Proof */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Join the fashion designers already on the waitlist
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
