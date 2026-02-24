'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { ArrowLeft, Mail, Check } from 'lucide-react';

export default function JoinEmailListPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [website, setWebsite] = useState('');
  const [formTimestamp] = useState(() => Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/email-list/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, website, _t: formTimestamp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      <main className="py-16 lg:py-24 overflow-hidden">
        <div className="max-w-xl mx-auto px-6 relative">
          {/* Decorative circles */}
          <div
            className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#CDA7B2] opacity-20 animate-float hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/4 -left-16 w-14 h-14 rounded-full bg-[#967F71] opacity-15 animate-float-slow hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/3 -left-8 w-8 h-8 rounded-full bg-[#CDA7B2] opacity-25 animate-float-delayed hidden lg:block"
            aria-hidden="true"
          />
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center text-[#967F71] hover:text-[#CDA7B2] transition-colors mb-8 font-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {success ? (
            /* Success State */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#CDA7B2]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-[#CDA7B2]" />
              </div>
              <h1 className="text-3xl font-light text-[#3B3937] mb-4">
                You're on the list!
              </h1>
              <p className="text-lg text-[#967F71] font-light mb-8">
                Check your inbox for a welcome email. We're excited to have you in our community.
              </p>
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="mb-8">
                <div className="w-12 h-12 bg-[#CDA7B2]/10 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6 text-[#CDA7B2]" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-500">
                  Join the Email List
                </h1>
                <p className="text-lg text-[#967F71] font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                  Get production tips, industry insights, and early access to new resources for fashion designers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field - visually hidden from users, bots auto-fill it */}
                <div className="absolute overflow-hidden" style={{ width: 0, height: 0, opacity: 0 }} aria-hidden="true">
                  <label htmlFor="join-website">Website</label>
                  <input
                    id="join-website"
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <Label htmlFor="firstName" className="text-[#3B3937] font-light">
                    First Name <span className="text-[#967F71]">(optional)</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="mt-2 h-12 border-[#967F71]/20 focus:border-[#CDA7B2] focus:ring-[#CDA7B2]"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#3B3937] font-light">
                    Email Address <span className="text-[#CDA7B2]">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="mt-2 h-12 border-[#967F71]/20 focus:border-[#CDA7B2] focus:ring-[#CDA7B2]"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 text-base font-normal tracking-wide disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join the List'}
                </Button>

                <p className="text-sm text-[#967F71] font-light text-center">
                  By subscribing, you agree to receive emails from Studio Systems. You can unsubscribe at any time.
                </p>
              </form>

              {/* What to Expect */}
              <div className="mt-12 pt-8 border-t border-[#967F71]/10">
                <h2 className="text-lg font-light text-[#3B3937] mb-4">What to expect:</h2>
                <ul className="space-y-3 text-[#967F71] font-light">
                  <li className="flex items-start gap-3">
                    <span className="text-[#CDA7B2]">—</span>
                    <span>Production tips and industry insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#CDA7B2]">—</span>
                    <span>Early access to new resources and templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#CDA7B2]">—</span>
                    <span>Exclusive content for our email community</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
