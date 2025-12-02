'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { StripeProvider } from '@/components/checkout/stripe-provider';
import { PaymentForm } from '@/components/checkout/payment-form';
import { ShoppingBag, Loader2, Shield, Check, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, removeItem, clearCart } = useCart();

  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Payment state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect if cart is empty after hydration
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/cart');
    }
  }, [isHydrated, items.length, router]);

  async function handleStartCheckout(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0 || !email) return;

    setIsCreatingPayment(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            productSource: item.productSource,
            quantity: item.quantity,
          })),
          customerEmail: email,
          customerName: name,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to start checkout');
      }

      const data = await response.json();

      // Handle free orders - skip payment and go directly to thank you
      if (data.isFreeOrder) {
        clearCart();
        router.push('/checkout/thank-you?source=cart&redirect_status=succeeded&free=true');
        return;
      }

      setClientSecret(data.clientSecret);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsCreatingPayment(false);
    }
  }

  // Loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#CDA7B2]" />
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5]">
        <MarketingHeader />

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl border border-[#EDEBE8] p-12 shadow-sm">
              <ShoppingBag className="w-16 h-16 text-[#CDA7B2] mx-auto mb-6" />
              <h1 className="text-3xl font-serif font-light text-[#3B3937] mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-[#967F71] font-light mb-8">
                Add some products to your cart before checking out.
              </p>
              <Link href="/products">
                <Button className="bg-[#CDA7B2] hover:bg-[#c49aa5] text-white px-8 py-3">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Back Button */}
      <div className="bg-[#faf8f5] border-b border-[#967F71]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/cart" className="text-[#CDA7B2] hover:text-[#BD97A2] flex items-center gap-2 font-light text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-light text-[#3B3937] mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Order Summary */}
          <div className="space-y-6">
            {/* Items */}
            <div className="bg-white rounded-2xl p-6 border border-[#EDEBE8] shadow-sm">
              <h2 className="font-medium text-[#3B3937] mb-4">
                Order Summary ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#faf8f5] flex-shrink-0">
                      {item.coverImageUrl ? (
                        <Image
                          src={item.coverImageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-[#CDA7B2]/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#3B3937] text-sm line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-[#967F71]">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#3B3937]">
                        {formatPrice(item.priceInCents * item.quantity)}
                      </p>
                      {!clientSecret && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-[#967F71] hover:text-red-500 transition-colors mt-1"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t border-[#EDEBE8]">
                <div className="flex justify-between text-lg font-medium text-[#3B3937]">
                  <span>Total</span>
                  <span className="text-[#CDA7B2]">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

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
          <div>
            <Card className="border-[#EDEBE8]">
              <CardContent className="pt-6">
                {!clientSecret ? (
                  <form onSubmit={handleStartCheckout} className="space-y-4">
                    <h2 className="font-medium text-[#3B3937] mb-4">Contact Information</h2>

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
                  <div>
                    <h2 className="font-medium text-[#3B3937] mb-4">Payment Details</h2>
                    <StripeProvider clientSecret={clientSecret}>
                      <PaymentForm
                        amount={totalPrice}
                        productName={items.map((i) => i.name).join(', ')}
                        returnUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/checkout/thank-you?source=cart`}
                      />
                    </StripeProvider>
                  </div>
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
