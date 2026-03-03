'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

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
      <div className="min-h-screen bg-[#faf8f5]">
        <MarketingHeader />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#CDA7B2]/10 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#CDA7B2]" />
          </div>
          <h1 className="font-serif-display text-4xl font-normal text-[#3B3937] mb-4">
            Application Received
          </h1>
          <p className="text-lg text-[#967F71] font-light mb-8 max-w-lg mx-auto leading-relaxed">
            Thank you for your application. If aligned, you will receive next steps to discuss partnership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide">
                Return to Home
              </Button>
            </Link>
            <Link href="/book">
              <Button variant="outline" className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide">
                Book a Consultation
              </Button>
            </Link>
          </div>
        </div>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">
            Partnership Application
          </p>
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-6">
            Apply to Work With Oceo Luxe
          </h1>
          <p className="text-lg text-[#967F71] font-light leading-relaxed">
            Every engagement begins with understanding where your brand is and where it needs to go. Complete this application so we can determine alignment.
          </p>
        </div>

        {/* Testimonial */}
        <div className="mb-12 border-l-2 border-[#CDA7B2] pl-8">
          <p className="font-serif-display text-lg lg:text-xl font-normal text-[#3B3937] leading-relaxed">
            &ldquo;If you&apos;re looking for someone who combines sharp business instincts with strong people skills, someone who brings both order and energy, Kerri&apos;s it.&rdquo;
          </p>
          <p className="text-[#967F71] font-light text-sm mt-4 tracking-wide uppercase">— Former Colleague</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label htmlFor="name" className="text-base font-medium text-[#3B3937]">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="mt-2 bg-white border-[#EDEBE8] focus:border-[#3B3937] focus:ring-[#3B3937]"
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-medium text-[#3B3937]">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              className="mt-2 bg-white border-[#EDEBE8] focus:border-[#3B3937] focus:ring-[#3B3937]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="socialHandle" className="text-base font-medium text-[#3B3937]">
              Brand Name *
            </Label>
            <Input
              id="socialHandle"
              value={formData.socialHandle}
              onChange={(e) => handleChange('socialHandle', e.target.value)}
              required
              className="mt-2 bg-white border-[#EDEBE8] focus:border-[#3B3937] focus:ring-[#3B3937]"
              placeholder="Your brand name"
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo" className="text-base font-medium text-[#3B3937]">
              Website
            </Label>
            <Input
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleChange('additionalInfo', e.target.value)}
              className="mt-2 bg-white border-[#EDEBE8] focus:border-[#3B3937] focus:ring-[#3B3937]"
              placeholder="https://yourbrand.com"
            />
          </div>

          <div>
            <Label htmlFor="interest" className="text-base font-medium text-[#3B3937]">
              Current Stage *
            </Label>
            <p className="text-sm text-[#967F71] font-light mt-1 mb-2">
              Where is your brand right now? Tell us about your products, production setup, and current operations.
            </p>
            <Textarea
              id="interest"
              value={formData.interest}
              onChange={(e) => handleChange('interest', e.target.value)}
              required
              rows={4}
              className="mt-1 bg-white border-[#EDEBE8] focus:border-[#3B3937] focus:ring-[#3B3937]"
              placeholder="Currently producing with two factories, managing 40 SKUs per season..."
            />
          </div>

          <div>
            <Label htmlFor="willingToInvest" className="text-base font-medium text-[#3B3937]">
              Revenue Range
            </Label>
            <p className="text-sm text-[#967F71] font-light mt-1 mb-2">
              Optional. Helps us understand the scale of your operations.
            </p>
            <select
              id="willingToInvest"
              value={formData.willingToInvest}
              onChange={(e) => handleChange('willingToInvest', e.target.value)}
              className="mt-1 w-full rounded-md bg-white border border-[#EDEBE8] px-3 py-2 text-[#3B3937] focus:border-[#3B3937] focus:ring-[#3B3937] focus:outline-none"
            >
              <option value="">Select a range</option>
              <option value="< 100k">Under $100K</option>
              <option value="100-500k">$100K – $500K</option>
              <option value="500k+">$500K+</option>
            </select>
          </div>

          <div>
            <Label htmlFor="obstacles" className="text-base font-medium text-[#3B3937]">
              Biggest Operational Challenge *
            </Label>
            <p className="text-sm text-[#967F71] font-light mt-1 mb-2">
              What is the primary operational issue you need resolved?
            </p>
            <Textarea
              id="obstacles"
              value={formData.obstacles}
              onChange={(e) => handleChange('obstacles', e.target.value)}
              required
              rows={4}
              className="mt-1 bg-white border-[#EDEBE8] focus:border-[#3B3937] focus:ring-[#3B3937]"
              placeholder="Managing multiple production timelines, supplier communication gaps..."
            />
          </div>

          <div>
            <Label htmlFor="experiences" className="text-base font-medium text-[#3B3937]">
              Why Oceo Luxe *
            </Label>
            <p className="text-sm text-[#967F71] font-light mt-1 mb-2">
              What drew you to Oceo Luxe, and what are you hoping to achieve through this partnership?
            </p>
            <Textarea
              id="experiences"
              value={formData.experiences}
              onChange={(e) => handleChange('experiences', e.target.value)}
              required
              rows={4}
              className="mt-1 bg-white border-[#EDEBE8] focus:border-[#3B3937] focus:ring-[#3B3937]"
              placeholder="Looking for a strategic partner who understands production at a high level..."
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
          <div className="border border-[#EDEBE8] rounded-lg p-4 bg-white">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#3B3937] focus:ring-[#3B3937]"
                required
              />
              <span className="text-sm text-[#967F71]">
                I agree to the{' '}
                <Link href="/privacy" className="text-[#3B3937] hover:underline" target="_blank">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/terms" className="text-[#3B3937] hover:underline" target="_blank">
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
              className="w-full bg-[#3B3937] hover:bg-[#4A4745] text-white text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Secondary CTA */}
        <div className="mt-12 text-center border-t border-[#EDEBE8] pt-12">
          <p className="text-[#967F71] font-light mb-4">
            Prefer to talk first?
          </p>
          <Link href="/book">
            <Button
              variant="outline"
              className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
            >
              Book a Consultation
            </Button>
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
