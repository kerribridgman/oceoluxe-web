'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle2, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/marketing-shell';

const ADHARA_SCHEDULING_SLUG = process.env.NEXT_PUBLIC_ADHARA_SCHEDULING_SLUG || 'consultation';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    topic: '',
    availability: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [proofToken] = useState(() => {
    const t = Date.now();
    return { _t: t, _proof: btoa(String(t).split('').reverse().join('') + 'luxe' + String(t % 9973)) };
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _honeypot: honeypot,
          _t: proofToken._t,
          _proof: proofToken._proof,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit request');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <MarketingShell>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--color-dusty-rose)]/10 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-[var(--color-dusty-rose)]" />
          </div>
          <h1 className="font-serif-display text-4xl font-normal text-[var(--color-cream)] mb-4">
            Request Received
          </h1>
          <p className="text-lg text-[var(--color-bone)] font-light mb-8 max-w-lg mx-auto leading-relaxed">
            Thank you for reaching out. I&apos;ll review your request and get back to you within 24 hours to schedule a time to connect.
          </p>

          {/* Scheduling CTA */}
          <div className="bg-[var(--color-charcoal)] border border-[var(--color-taupe)]/20 rounded-xl p-8 mb-8 max-w-md mx-auto">
            <Calendar className="w-8 h-8 text-[var(--color-dusty-rose)] mx-auto mb-4" />
            <h2 className="font-serif-display text-xl font-normal text-[var(--color-cream)] mb-2">
              Want to book now?
            </h2>
            <p className="text-sm text-[var(--color-bone)] font-light mb-6">
              Skip the wait and schedule a 15-minute consultation directly.
            </p>
            <a
              href={`https://app.adharaweb.com/schedule/${ADHARA_SCHEDULING_SLUG}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[var(--color-dusty-rose)] hover:bg-[var(--color-rose-deep)] text-[var(--color-ink)] h-12 px-8 text-base font-normal tracking-wide">
                <Calendar className="w-5 h-5 mr-2" />
                Book a Consultation
              </Button>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide">
                Return to Home
              </Button>
            </Link>
            <Link href="/consultations">
              <Button variant="outline" className="border-[var(--color-taupe)] text-[var(--color-bone)] hover:bg-[var(--color-taupe)] hover:text-[var(--color-cream)] h-12 px-8 text-base font-normal tracking-wide">
                View Consultations
              </Button>
            </Link>
          </div>
        </div>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>

      <div className="max-w-5xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left Column — Form */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-12">
              <p className="font-script text-3xl lg:text-4xl italic text-[var(--color-dusty-rose)] mb-4">
                Get in Touch
              </p>
              <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[var(--color-cream)] leading-[1.15] tracking-tight mb-6">
                Request a Consultation
              </h1>
              <p className="text-lg text-[var(--color-bone)] font-light leading-relaxed">
                Tell me about your production challenge and when you&apos;re available. I&apos;ll review your request and reach out within 24 hours.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <Label htmlFor="full_name" className="text-base font-medium text-[var(--color-cream)]">
                  Your Name *
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  required
                  className="mt-2 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-medium text-[var(--color-cream)]">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="mt-2 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-base font-medium text-[var(--color-cream)]">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  className="mt-2 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="topic" className="text-base font-medium text-[var(--color-cream)]">
                  What would you like to discuss? *
                </Label>
                <p className="text-sm text-[var(--color-bone)] font-light mt-1 mb-2">
                  Describe your production challenge, question, or project.
                </p>
                <Textarea
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                  required
                  rows={4}
                  className="mt-1 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
                  placeholder="I need help evaluating a new factory relationship before placing a $150K order..."
                />
              </div>

              <div>
                <Label htmlFor="availability" className="text-base font-medium text-[var(--color-cream)]">
                  Your Availability *
                </Label>
                <p className="text-sm text-[var(--color-bone)] font-light mt-1 mb-2">
                  When are you available for a consultation call?
                </p>
                <Textarea
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleChange('availability', e.target.value)}
                  required
                  rows={3}
                  className="mt-1 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
                  placeholder="e.g., Weekdays 9am-5pm PST, specific dates, etc."
                />
              </div>

              {/* Honeypot field */}
              <div className="absolute overflow-hidden" style={{ width: 0, height: 0, opacity: 0 }} aria-hidden="true">
                <label htmlFor="contact-company-url">Company URL</label>
                <input
                  id="contact-company-url"
                  type="text"
                  name="company_url"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Privacy Consent */}
              <div className="border border-[var(--color-taupe)]/30 rounded-lg p-4 bg-[var(--color-charcoal)]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
                    required
                  />
                  <span className="text-sm text-[var(--color-bone)]">
                    I agree to the{' '}
                    <Link href="/privacy" className="text-[var(--color-cream)] hover:underline" target="_blank">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/terms" className="text-[var(--color-cream)] hover:underline" target="_blank">
                      Terms of Service
                    </Link>
                    . I consent to having my information processed for the purpose of scheduling a consultation. *
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitting || !privacyConsent}
                  className="w-full bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Request Consultation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column — Scheduling + Info */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8 space-y-8">
              {/* Schedule Directly Card */}
              <div className="bg-[var(--color-charcoal)] border border-[var(--color-taupe)]/20 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-dusty-rose)]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[var(--color-dusty-rose)]" />
                  </div>
                  <h2 className="font-serif-display text-xl font-normal text-[var(--color-cream)]">
                    Book Directly
                  </h2>
                </div>
                <p className="text-sm text-[var(--color-bone)] font-light mb-6 leading-relaxed">
                  Prefer to pick a time now? Schedule a 15-minute consultation call directly from my calendar.
                </p>
                <a
                  href={`https://app.adharaweb.com/schedule/${ADHARA_SCHEDULING_SLUG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-[var(--color-dusty-rose)] hover:bg-[var(--color-rose-deep)] text-[var(--color-ink)] h-12 text-base font-normal tracking-wide">
                    <Calendar className="w-5 h-5 mr-2" />
                    View Available Times
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>

              {/* What to Expect */}
              <div className="bg-[var(--color-charcoal)] border border-[var(--color-taupe)]/20 rounded-xl p-8">
                <h3 className="font-serif-display text-lg font-normal text-[var(--color-cream)] mb-4">
                  What to Expect
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-dusty-rose)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-[var(--color-dusty-rose)]">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-cream)]">Submit your request</p>
                      <p className="text-xs text-[var(--color-bone)] font-light">Tell me about your challenge and availability</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-dusty-rose)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-[var(--color-dusty-rose)]">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-cream)]">I review within 24 hours</p>
                      <p className="text-xs text-[var(--color-bone)] font-light">I&apos;ll assess fit and prepare for our conversation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-dusty-rose)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-[var(--color-dusty-rose)]">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-cream)]">We connect</p>
                      <p className="text-xs text-[var(--color-bone)] font-light">A focused conversation about your production needs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-[var(--color-charcoal)] rounded-xl p-8 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-[var(--color-dusty-rose)]" />
                  <span className="text-sm font-light">15-minute initial consultation</span>
                </div>
                <div className="w-8 h-px bg-[var(--color-dusty-rose)] mb-4" />
                <p className="font-script text-lg italic text-[var(--color-dusty-rose)] leading-relaxed">
                  &ldquo;Your factory will say everything is under control. We make sure it actually is.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </MarketingShell>
  );
}
