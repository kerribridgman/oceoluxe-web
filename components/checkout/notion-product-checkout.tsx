'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { StripeProvider } from '@/components/checkout/stripe-provider';
import { PaymentForm } from '@/components/checkout/payment-form';
import { Loader2, Shield, Check, ShoppingCart } from 'lucide-react';

interface NotionProductCheckoutProps {
  productSlug: string;
  productTitle: string;
  priceInCents: number;
}

export function NotionProductCheckout({
  productSlug,
  productTitle,
  priceInCents,
}: NotionProductCheckoutProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function formatPrice(cents: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  }

  async function handleStartCheckout(e: React.FormEvent) {
    e.preventDefault();

    if (!email) return;

    setIsCreatingPayment(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/notion-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: productSlug,
          customerEmail: email,
          customerName: name,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to start checkout');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsCreatingPayment(false);
    }
  }

  return (
    <Card className="border-[#EDEBE8] bg-white shadow-xl">
      <CardContent className="pt-6">
        {/* Price Header */}
        <div className="text-center mb-6 pb-6 border-b border-[#EDEBE8]">
          <div className="text-4xl font-serif font-light text-[#3B3937] mb-2">
            {formatPrice(priceInCents)}
          </div>
          <p className="text-[#967F71] text-sm">One-time payment</p>
        </div>

        {!clientSecret ? (
          <form onSubmit={handleStartCheckout} className="space-y-4">
            <div>
              <Label htmlFor="checkout-email">Email *</Label>
              <Input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="checkout-name">Name</Label>
              <Input
                id="checkout-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isCreatingPayment || !email}
              className="w-full bg-[#3B3937] hover:bg-[#4A4745] text-white h-14 text-lg"
            >
              {isCreatingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now - {formatPrice(priceInCents)}
                </>
              )}
            </Button>
          </form>
        ) : (
          <StripeProvider clientSecret={clientSecret}>
            <PaymentForm
              amount={priceInCents}
              productName={productTitle}
              returnUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/checkout/thank-you?product=${productSlug}`}
            />
          </StripeProvider>
        )}

        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-[#EDEBE8]">
          <div className="flex items-center justify-center gap-6 text-sm text-[#967F71]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secure checkout
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Instant access
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
