'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Mail } from 'lucide-react';

const STORAGE_KEY = 'email_signup_dismissed';
const POPUP_DELAY_MS = 5000; // 5 seconds delay before showing

interface EmailSignupModalProps {
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EmailSignupModal({ forceOpen, onOpenChange }: EmailSignupModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [website, setWebsite] = useState('');
  const [formTimestamp] = useState(() => Date.now());
  const [proofToken] = useState(() => {
    const t = Date.now();
    return { _t: t, _proof: btoa(String(t).split('').reverse().join('') + 'luxe' + String(t % 9973)) };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If forceOpen is provided, use it directly
    if (forceOpen !== undefined) {
      setOpen(forceOpen);
      return;
    }

    // Check if user has already dismissed the modal
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      return;
    }

    // Show modal after delay
    const timer = setTimeout(() => {
      setOpen(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [forceOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);

    // If closing without success, mark as dismissed
    if (!newOpen && !success) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/email-list/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, website, _t: proofToken._t, _proof: proofToken._proof }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      // Mark as dismissed so it doesn't show again
      localStorage.setItem(STORAGE_KEY, 'true');

      // Auto-close after success
      setTimeout(() => {
        handleOpenChange(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#faf8f5] border-[#967F71]/20">
        {success ? (
          /* Success State */
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-[#CDA7B2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-[#CDA7B2]" />
            </div>
            <DialogTitle className="text-2xl font-light text-[#3B3937] mb-2">
              You're on the list!
            </DialogTitle>
            <DialogDescription className="text-[#967F71] font-light">
              Check your inbox for a welcome email.
            </DialogDescription>
          </div>
        ) : (
          /* Form State */
          <>
            <DialogHeader className="text-center sm:text-center">
              <div className="w-12 h-12 bg-[#CDA7B2]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-[#CDA7B2]" />
              </div>
              <DialogTitle className="text-2xl font-light text-[#3B3937]">
                Stay in the Loop
              </DialogTitle>
              <DialogDescription className="text-[#967F71] font-light">
                Get production tips, industry insights, and early access to new resources.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="modal-firstName" className="text-[#3B3937] font-light text-sm">
                  First Name <span className="text-[#967F71]">(optional)</span>
                </Label>
                <Input
                  id="modal-firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  className="mt-1 h-11 border-[#967F71]/20 focus:border-[#CDA7B2] focus:ring-[#CDA7B2] bg-white"
                />
              </div>

              <div>
                <Label htmlFor="modal-email" className="text-[#3B3937] font-light text-sm">
                  Email Address <span className="text-[#CDA7B2]">*</span>
                </Label>
                <Input
                  id="modal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1 h-11 border-[#967F71]/20 focus:border-[#CDA7B2] focus:ring-[#CDA7B2] bg-white"
                />
              </div>

              {/* Honeypot field - visually hidden from users, bots auto-fill it */}
              <div className="absolute overflow-hidden" style={{ width: 0, height: 0, opacity: 0 }} aria-hidden="true">
                <label htmlFor="modal-website">Website</label>
                <input
                  id="modal-website"
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3B3937] hover:bg-[#4A4745] text-white h-11 text-base font-normal tracking-wide disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join the List'}
              </Button>

              <p className="text-xs text-[#967F71] font-light text-center">
                You can unsubscribe at any time.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
