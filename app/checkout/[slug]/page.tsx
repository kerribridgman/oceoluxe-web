'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { StripeProvider } from '@/components/checkout/stripe-provider';
import { PaymentForm } from '@/components/checkout/payment-form';
import { Check, Package, Loader2, Shield, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  coverImageUrl: string | null;
  productType: 'one_time' | 'subscription';
  priceInCents: number;
  yearlyPriceInCents: number | null;
  currency: string;
  deliveryType: string;
}

interface UpsellProduct {
  id: number;
  name: string;
  shortDescription: string | null;
  priceInCents: number;
  discountPercent?: number;
}

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [upsells, setUpsells] = useState<UpsellProduct[]>([]);
  const [selectedUpsells, setSelectedUpsells] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  // Payment state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/products/public/${slug}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data.product);
      setUpsells(data.upsells || []);
    } catch (err) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  }

  async function handleStartCheckout(e: React.FormEvent) {
    e.preventDefault();

    if (!product || !email) return;

    setIsCreatingPayment(true);
    setError(null);

    try {
      const endpoint = product.productType === 'subscription'
        ? '/api/checkout/create-subscription'
        : '/api/checkout/create-payment-intent';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerEmail: email,
          customerName: name,
          billingInterval: product.productType === 'subscription' ? billingInterval : undefined,
          upsellIds: selectedUpsells,
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

  function toggleUpsell(id: number) {
    setSelectedUpsells((prev) =>
      prev.includes(id) ? prev.filter((uId) => uId !== id) : [...prev, id]
    );
  }

  function formatPrice(cents: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  }

  function calculateTotal() {
    if (!product) return 0;

    let total = product.productType === 'subscription' && billingInterval === 'year' && product.yearlyPriceInCents
      ? product.yearlyPriceInCents
      : product.priceInCents;

    for (const upsellId of selectedUpsells) {
      const upsell = upsells.find((u) => u.id === upsellId);
      if (upsell) {
        total += upsell.priceInCents;
      }
    }

    return total;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#CDA7B2]" />
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-[#faf8f5]">
        <MarketingHeader />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-light text-[#3B3937] mb-2">Product Not Found</h1>
          <p className="text-[#967F71]">The product you're looking for doesn't exist or is no longer available.</p>
        </div>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Product Info & Upsells */}
          <div className="space-y-8">
            {/* Product Summary */}
            <div className="bg-white rounded-2xl p-6 border border-[#EDEBE8] shadow-sm">
              <div className="flex gap-4">
                {product?.coverImageUrl ? (
                  <img
                    src={product.coverImageUrl}
                    alt={product.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-[#CDA7B2]/20 to-[#967F71]/20 flex items-center justify-center">
                    <Package className="w-10 h-10 text-[#CDA7B2]" />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-serif font-light text-[#3B3937]">{product?.name}</h1>
                  {product?.shortDescription && (
                    <p className="text-[#967F71] mt-1 text-sm">{product.shortDescription}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Toggle for Subscriptions */}
            {product?.productType === 'subscription' && product.yearlyPriceInCents && (
              <div className="bg-white rounded-2xl p-6 border border-[#EDEBE8] shadow-sm">
                <h3 className="font-medium text-[#3B3937] mb-4">Choose your billing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setBillingInterval('month')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      billingInterval === 'month'
                        ? 'border-[#CDA7B2] bg-[#CDA7B2]/5'
                        : 'border-[#EDEBE8] hover:border-[#CDA7B2]/50'
                    }`}
                  >
                    <div className="text-lg font-serif font-light text-[#3B3937]">
                      {formatPrice(product.priceInCents)}/mo
                    </div>
                    <div className="text-sm text-[#967F71]">Billed monthly</div>
                  </button>
                  <button
                    onClick={() => setBillingInterval('year')}
                    className={`p-4 rounded-xl border-2 transition-all relative ${
                      billingInterval === 'year'
                        ? 'border-[#CDA7B2] bg-[#CDA7B2]/5'
                        : 'border-[#EDEBE8] hover:border-[#CDA7B2]/50'
                    }`}
                  >
                    {product.yearlyPriceInCents < product.priceInCents * 12 && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Save {Math.round((1 - product.yearlyPriceInCents / (product.priceInCents * 12)) * 100)}%
                      </div>
                    )}
                    <div className="text-lg font-serif font-light text-[#3B3937]">
                      {formatPrice(product.yearlyPriceInCents)}/yr
                    </div>
                    <div className="text-sm text-[#967F71]">Billed yearly</div>
                  </button>
                </div>
              </div>
            )}

            {/* Upsells */}
            {upsells.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#EDEBE8] shadow-sm">
                <h3 className="font-medium text-[#3B3937] mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Add to your order
                </h3>
                <div className="space-y-3">
                  {upsells.map((upsell) => (
                    <button
                      key={upsell.id}
                      onClick={() => toggleUpsell(upsell.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                        selectedUpsells.includes(upsell.id)
                          ? 'border-[#CDA7B2] bg-[#CDA7B2]/5'
                          : 'border-[#EDEBE8] hover:border-[#CDA7B2]/50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedUpsells.includes(upsell.id)
                          ? 'border-[#CDA7B2] bg-[#CDA7B2] text-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedUpsells.includes(upsell.id) && <Check className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#3B3937]">{upsell.name}</div>
                        {upsell.shortDescription && (
                          <div className="text-sm text-[#967F71]">{upsell.shortDescription}</div>
                        )}
                      </div>
                      <div className="font-serif text-[#CDA7B2]">
                        +{formatPrice(upsell.priceInCents)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 text-sm text-[#967F71]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Secure checkout
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Instant access
              </div>
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div className="space-y-6">
            <Card className="border-[#EDEBE8]">
              <CardContent className="pt-6">
                {/* Order Summary */}
                <div className="mb-6 pb-6 border-b border-[#EDEBE8]">
                  <h3 className="font-medium text-[#3B3937] mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#967F71]">{product?.name}</span>
                      <span className="text-[#3B3937]">
                        {formatPrice(
                          product?.productType === 'subscription' && billingInterval === 'year' && product.yearlyPriceInCents
                            ? product.yearlyPriceInCents
                            : product?.priceInCents || 0
                        )}
                      </span>
                    </div>
                    {selectedUpsells.map((upsellId) => {
                      const upsell = upsells.find((u) => u.id === upsellId);
                      if (!upsell) return null;
                      return (
                        <div key={upsellId} className="flex justify-between">
                          <span className="text-[#967F71]">{upsell.name}</span>
                          <span className="text-[#3B3937]">{formatPrice(upsell.priceInCents)}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between pt-2 border-t border-[#EDEBE8] font-medium">
                      <span className="text-[#3B3937]">Total</span>
                      <span className="text-[#CDA7B2] text-lg">
                        {formatPrice(calculateTotal())}
                        {product?.productType === 'subscription' && (
                          <span className="text-sm text-[#967F71]">
                            /{billingInterval === 'month' ? 'mo' : 'yr'}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {!clientSecret ? (
                  <form onSubmit={handleStartCheckout} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
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
                        'Continue to Payment'
                      )}
                    </Button>
                  </form>
                ) : (
                  <StripeProvider clientSecret={clientSecret}>
                    <PaymentForm
                      amount={calculateTotal()}
                      productName={product?.name || ''}
                      billingInterval={product?.productType === 'subscription' ? billingInterval : undefined}
                      returnUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/checkout/thank-you?product=${product?.slug}`}
                    />
                  </StripeProvider>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
