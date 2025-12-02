'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Mail, CheckCircle2, Gift } from 'lucide-react';

interface FreeProductClaimFormProps {
  productSlug: string;
  productName: string;
}

export function FreeProductClaimForm({ productSlug, productName }: FreeProductClaimFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !name) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/leads/claim-free-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          productSlug,
          productName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to process your request');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-[#3B3937] text-lg">Check Your Email!</h3>
              <p className="text-[#967F71] text-sm mt-2">
                We've sent your free download link to <strong>{email}</strong>
              </p>
            </div>
            <p className="text-xs text-[#967F71]">
              Don't see it? Check your spam folder or contact us at kerrib@oceoluxe.com
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#CDA7B2]/30 bg-gradient-to-br from-[#CDA7B2]/5 to-[#967F71]/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#CDA7B2]/20 rounded-full flex items-center justify-center">
            <Gift className="w-5 h-5 text-[#CDA7B2]" />
          </div>
          <div>
            <h3 className="font-medium text-[#3B3937]">Get Your Free Download</h3>
            <p className="text-sm text-[#967F71]">Enter your email to receive instant access</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-[#3B3937]">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1 border-[#EDEBE8] focus:border-[#CDA7B2] focus:ring-[#CDA7B2]"
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-[#3B3937]">Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="mt-1 border-[#EDEBE8] focus:border-[#CDA7B2] focus:ring-[#CDA7B2]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !email || !name}
            className="w-full bg-[#CDA7B2] hover:bg-[#c49aa5] text-white h-12 text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Me the Free Download
              </>
            )}
          </Button>

          <p className="text-xs text-center text-[#967F71]">
            We'll email you a link to access your free resource. No spam, ever.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
