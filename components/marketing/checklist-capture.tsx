'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'oceo-checklist-subscribed';

interface ChecklistCaptureProps {
  variant?: 'light' | 'dark';
}

export function ChecklistCapture({ variant = 'light' }: ChecklistCaptureProps) {
  const isDark = variant === 'dark';
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [website, setWebsite] = useState('');
  const [proofToken] = useState(() => {
    const t = Date.now();
    return { _t: t, _proof: btoa(String(t).split('').reverse().join('') + 'luxe' + String(t % 9973)) };
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAlreadySubscribed(localStorage.getItem(STORAGE_KEY) === 'true');
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/email-list/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          website,
          source: 'production_risk_checklist',
          _t: proofToken._t,
          _proof: proofToken._proof,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong.');
        return;
      }

      setStatus('success');
      localStorage.setItem(STORAGE_KEY, 'true');
      setAlreadySubscribed(true);
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  // Already subscribed — confirmation state
  if (alreadySubscribed || status === 'success') {
    if (isDark) {
      return (
        <div className="text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-6 h-6 text-[#CDA7B2]" />
          </div>
          <h3 className="font-serif-display text-2xl font-normal text-white tracking-tight mb-3">
            Your checklist is on the way
          </h3>
          <p className="text-white/60 font-light">
            Check your inbox for the 12-Point Production Risk Checklist.
          </p>
        </div>
      );
    }

    return (
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-lg border border-[#CDA7B2]/20 bg-white p-10 lg:p-12 text-center">
            <div className="w-12 h-12 bg-[#CDA7B2]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="w-6 h-6 text-[#CDA7B2]" />
            </div>
            <h3 className="font-serif-display text-2xl font-normal text-[#3B3937] tracking-tight mb-3">
              Your checklist is on the way
            </h3>
            <p className="text-[#967F71] font-light">
              Check your inbox for the 12-Point Production Risk Checklist.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Dark variant — inline within charcoal section, no wrapper section
  if (isDark) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">
          Not ready to talk yet?
        </p>
        <h3 className="font-serif-display text-3xl lg:text-4xl font-normal text-white tracking-tight mb-6">
          Get the 12-Point Production Risk Checklist
        </h3>
        <p className="text-lg text-white/70 font-light leading-relaxed mb-8">
          The same framework used in our client assessments. Review your production plan against the 12 risks that cost fashion brands the most money every season.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          {/* Honeypot field */}
          <div className="absolute overflow-hidden" style={{ width: 0, height: 0, opacity: 0 }} aria-hidden="true">
            <label htmlFor="checklist-website-dark">Website</label>
            <input
              id="checklist-website-dark"
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base font-light placeholder:text-white/40 focus:outline-none focus:border-[#CDA7B2] transition-colors"
          />
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white text-[#3B3937] hover:bg-white/90 px-6 py-3 text-base font-normal tracking-wide h-auto"
          >
            {status === 'loading' ? 'Sending...' : (
              <>
                Send the Checklist
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-sm text-red-400 mt-3">{errorMessage}</p>
        )}
        <p className="text-xs text-white/40 font-light mt-4">
          No spam. Just the checklist delivered to your inbox.
        </p>
      </div>
    );
  }

  // Light variant — standalone section with white card
  return (
    <section className="section-spacing bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-lg border border-[#e8e2dc] bg-white p-8 lg:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-script text-xl lg:text-2xl italic text-[#CDA7B2] mb-3">
              Free resource
            </p>
            <h3 className="font-serif-display text-2xl lg:text-3xl font-normal text-[#3B3937] tracking-tight mb-4">
              The 12-Point Production Risk Checklist
            </h3>
            <p className="text-lg text-[#967F71] font-light leading-relaxed mb-8">
              The same framework used in our client assessments. Review your production plan against the 12 risks that cost fashion brands the most money every season.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              {/* Honeypot field */}
              <div className="absolute overflow-hidden" style={{ width: 0, height: 0, opacity: 0 }} aria-hidden="true">
                <label htmlFor="checklist-website">Website</label>
                <input
                  id="checklist-website"
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg border border-[#967F71]/20 bg-[#faf8f5] text-[#3B3937] text-base font-light placeholder:text-[#967F71]/50 focus:outline-none focus:border-[#CDA7B2] transition-colors"
              />
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#3B3937] hover:bg-[#3B3937]/90 text-white px-6 py-3 text-base font-normal tracking-wide h-auto"
              >
                {status === 'loading' ? 'Sending...' : (
                  <>
                    Send the Checklist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            {status === 'error' && (
              <p className="text-sm text-red-500 mt-3">{errorMessage}</p>
            )}
            <p className="text-xs text-[#967F71]/60 font-light mt-4">
              No spam. Just the checklist delivered to your inbox.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
