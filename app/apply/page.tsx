'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { AnimateIn } from '@/components/animate-in';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    socialHandle: '',
    additionalInfo: '',
    interest: '',
    willingToInvest: '',
    obstacles: '',
    experiences: '',
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
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'operational-partnership',
          _honeypot: honeypot,
          _t: proofToken._t,
          _proof: proofToken._proof,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit application');
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
            Application Received
          </h1>
          <p className="text-lg text-[var(--color-bone)] font-light mb-8 max-w-lg mx-auto leading-relaxed">
            Thank you for sharing your production details. If aligned, you will receive next steps to discuss how we can protect your next order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                Return to Home
              </Button>
            </Link>
            <Link href="/book">
              <Button variant="outline" className="border-[var(--color-taupe)] text-[var(--color-bone)] hover:bg-[var(--color-taupe)] hover:text-[var(--color-cream)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                Book a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        {/* Header */}
        <AnimateIn animation="fade-in">
          <div className="mb-12">
            <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[var(--color-cream)] leading-[1.15] tracking-tight mb-6 text-glow-warm">
              Apply to Work With Oceo Luxe
            </h1>
            <p className="text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              Oceo Luxe is application-only. Every partnership begins with a conversation. The studio is selective about who it works with because the work requires alignment on both sides. The application below is the first step.
            </p>
          </div>
        </AnimateIn>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label htmlFor="name" className="text-base font-medium text-[var(--color-cream)]">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="mt-2 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-medium text-[var(--color-cream)]">
              Email *
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
            <Label htmlFor="socialHandle" className="text-base font-medium text-[var(--color-cream)]">
              Brand Name *
            </Label>
            <Input
              id="socialHandle"
              value={formData.socialHandle}
              onChange={(e) => handleChange('socialHandle', e.target.value)}
              required
              className="mt-2 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
              placeholder="Your brand name"
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo" className="text-base font-medium text-[var(--color-cream)]">
              Website
            </Label>
            <Input
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleChange('additionalInfo', e.target.value)}
              className="mt-2 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
              placeholder="https://yourbrand.com"
            />
          </div>

          <div>
            <Label htmlFor="interest" className="text-base font-medium text-[var(--color-cream)]">
              Current Stage *
            </Label>
            <p className="text-sm text-[var(--color-bone)] font-light mt-1 mb-2">
              Where is your brand right now? Tell us about your products, production volume, and factory relationships.
            </p>
            <Textarea
              id="interest"
              value={formData.interest}
              onChange={(e) => handleChange('interest', e.target.value)}
              required
              rows={4}
              className="mt-1 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
              placeholder="Currently producing with two factories, managing 40 SKUs per season..."
            />
          </div>

          <div>
            <Label htmlFor="willingToInvest" className="text-base font-medium text-[var(--color-cream)]">
              Revenue Range
            </Label>
            <p className="text-sm text-[var(--color-bone)] font-light mt-1 mb-2">
              Optional. Helps us understand the scale of your operations.
            </p>
            <select
              id="willingToInvest"
              value={formData.willingToInvest}
              onChange={(e) => handleChange('willingToInvest', e.target.value)}
              className="mt-1 w-full rounded-md bg-[var(--color-charcoal)] border border-[var(--color-taupe)]/30 px-3 py-2 text-[var(--color-cream)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)] focus:outline-none"
            >
              <option value="">Select a range</option>
              <option value="< 100k">Under $100K</option>
              <option value="100-500k">$100K - $500K</option>
              <option value="500k+">$500K+</option>
            </select>
          </div>

          <div>
            <Label htmlFor="obstacles" className="text-base font-medium text-[var(--color-cream)]">
              Biggest Production Risk *
            </Label>
            <p className="text-sm text-[var(--color-bone)] font-light mt-1 mb-2">
              What is the primary production challenge or risk you need addressed?
            </p>
            <Textarea
              id="obstacles"
              value={formData.obstacles}
              onChange={(e) => handleChange('obstacles', e.target.value)}
              required
              rows={4}
              className="mt-1 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
              placeholder="Factory costing feels off, timeline keeps slipping, no one reviewing quality checkpoints..."
            />
          </div>

          <div>
            <Label htmlFor="experiences" className="text-base font-medium text-[var(--color-cream)]">
              Why Oceo Luxe *
            </Label>
            <p className="text-sm text-[var(--color-bone)] font-light mt-1 mb-2">
              What drew you to Oceo Luxe, and what outcome would make this engagement worth it?
            </p>
            <Textarea
              id="experiences"
              value={formData.experiences}
              onChange={(e) => handleChange('experiences', e.target.value)}
              required
              rows={4}
              className="mt-1 bg-[var(--color-charcoal)] border-[var(--color-taupe)]/30 text-[var(--color-cream)] placeholder:text-[var(--color-taupe)] focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]"
              placeholder="Need someone who can verify our factory is actually delivering what they promised..."
            />
          </div>

          {/* Honeypot field - visually hidden from users, bots auto-fill it */}
          <div className="absolute overflow-hidden" style={{ width: 0, height: 0, opacity: 0 }} aria-hidden="true">
            <label htmlFor="apply-company-url">Company URL</label>
            <input
              id="apply-company-url"
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
                . I consent to having my information processed for the purpose of reviewing my application and being contacted about services. *
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
              className="w-full bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Testimonial */}
        <AnimateIn>
          <div className="mt-12 border-l-2 border-[var(--color-dusty-rose)] pl-8 py-6 bg-[var(--color-dusty-rose)]/5 rounded-r-lg">
            <p className="font-serif-display text-lg lg:text-xl font-normal text-[var(--color-cream)] leading-relaxed">
              &ldquo;If you&apos;re looking for someone who combines sharp business instincts with strong people skills, someone who brings both order and energy, Kerri&apos;s it.&rdquo;
            </p>
            <p className="text-[var(--color-bone)] font-light text-sm mt-4 tracking-wide uppercase">&ndash; C-Suite Executive</p>
          </div>
        </AnimateIn>

        {/* Secondary CTA */}
        <AnimateIn>
          <div className="mt-12 text-center border-t border-[var(--color-taupe)]/20 pt-12">
            <p className="text-xl text-[var(--color-bone)] font-light mb-4">
              Prefer to talk first?
            </p>
            <Link href="/book">
              <Button
                variant="outline"
                className="border-[var(--color-taupe)] text-[var(--color-bone)] hover:bg-[var(--color-taupe)] hover:text-[var(--color-cream)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Book a Consultation
              </Button>
            </Link>
          </div>
        </AnimateIn>
      </div>

    </MarketingShell>
  );
}
