'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const STORAGE_KEY = 'oceo-inline-signup-subscribed';

export function InlineEmailSignup() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [website, setWebsite] = useState('');
  const [formTimestamp] = useState(() => Date.now());
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
        body: JSON.stringify({ email, firstName, website, _t: proofToken._t, _proof: proofToken._proof }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong.');
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

  // Already subscribed or just submitted — show confirmation
  if (alreadySubscribed || status === 'success') {
    return (
      <div className="my-16 rounded-xl border border-[var(--color-dusty-rose)]/20 bg-[var(--color-dusty-rose)]/5 p-8 md:p-10">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-10 h-10 bg-[var(--color-dusty-rose)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-5 h-5 text-[var(--color-dusty-rose)]" />
          </div>
          <h3 className="text-xl font-light text-[var(--color-cream)] tracking-tight mb-2">
            You're on the list
          </h3>
          <p className="text-sm text-[var(--color-bone)] font-light">
            Production tips and insights are headed your way.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16 rounded-xl border border-[var(--color-taupe)]/10 bg-[var(--color-charcoal)] p-8 md:p-10">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-[var(--color-dusty-rose)] text-xs uppercase tracking-widest font-medium mb-3">
          Stay in the Loop
        </p>
        <h3 className="text-xl font-light text-[var(--color-cream)] tracking-tight mb-2">
          Get production tips and insights delivered to your inbox
        </h3>
        <p className="text-sm text-[var(--color-bone)] font-light mb-6">
          Join designers who are building smarter production systems.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          {/* Honeypot field - visually hidden from users, bots auto-fill it */}
          <div className="absolute overflow-hidden" style={{ width: 0, height: 0, opacity: 0 }} aria-hidden="true">
            <label htmlFor="inline-website">Website</label>
            <input
              id="inline-website"
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <input
            type="text"
            placeholder="Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-taupe)]/30 bg-[var(--color-ink)] text-[var(--color-cream)] text-sm font-light placeholder:text-[var(--color-taupe)] focus:outline-none focus:border-[var(--color-dusty-rose)] transition-colors"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-taupe)]/30 bg-[var(--color-ink)] text-[var(--color-cream)] text-sm font-light placeholder:text-[var(--color-taupe)] focus:outline-none focus:border-[var(--color-dusty-rose)] transition-colors"
          />
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[var(--color-dusty-rose)] hover:bg-[var(--color-rose-deep)] text-[var(--color-ink)] px-6 py-2.5 text-sm font-normal tracking-wide"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-sm text-red-500 mt-3">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
