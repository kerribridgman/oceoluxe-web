'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { CheckCircle2, Download, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  deliveryType: string;
  downloadUrl: string | null;
  accessInstructions: string | null;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');
  const source = searchParams.get('source');
  const paymentIntent = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  const { clearCart } = useCart();
  const cartClearedRef = useRef(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const isCartCheckout = source === 'cart';
  const isSuccess = redirectStatus === 'succeeded';

  // Clear cart after successful cart checkout
  useEffect(() => {
    if (isCartCheckout && isSuccess && !cartClearedRef.current) {
      cartClearedRef.current = true;
      clearCart();
    }
  }, [isCartCheckout, isSuccess, clearCart]);

  useEffect(() => {
    if (productSlug) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productSlug]);

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/products/public/${productSlug}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#CDA7B2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      <div className="max-w-2xl mx-auto px-4 py-24">
        <Card className="border-[#EDEBE8] overflow-hidden">
          <div className="bg-gradient-to-br from-[#CDA7B2] to-[#967F71] p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-serif font-light text-white mb-2">
              {isSuccess ? 'Thank You!' : 'Processing...'}
            </h1>
            <p className="text-white/80">
              {isSuccess
                ? 'Your payment was successful'
                : 'Your payment is being processed'}
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            {product && (
              <div className="bg-[#F5F3F0] rounded-xl p-6">
                <h2 className="font-medium text-[#3B3937] mb-2">Order Details</h2>
                <p className="text-lg font-serif text-[#CDA7B2]">{product.name}</p>
              </div>
            )}

            {isCartCheckout && !product && (
              <div className="bg-[#F5F3F0] rounded-xl p-6">
                <h2 className="font-medium text-[#3B3937] mb-2">Order Complete</h2>
                <p className="text-[#967F71]">Your cart purchase has been processed successfully.</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <Mail className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-[#3B3937]">Check Your Email</h3>
                  <p className="text-sm text-[#967F71]">
                    We've sent a confirmation email with your purchase details and access information.
                  </p>
                </div>
              </div>

              {product?.deliveryType === 'download' && product.downloadUrl && (
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <Download className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-[#3B3937]">Download Your Product</h3>
                    <p className="text-sm text-[#967F71] mb-3">
                      Your download is ready! Click below to get your files.
                    </p>
                    <a
                      href={product.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Now
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {product?.deliveryType === 'access' && product.accessInstructions && (
                <div className="p-4 bg-[#F5F3F0] rounded-xl">
                  <h3 className="font-medium text-[#3B3937] mb-2">Access Instructions</h3>
                  <p className="text-sm text-[#967F71] whitespace-pre-wrap">
                    {product.accessInstructions}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#EDEBE8] text-center">
              <Link href="/products">
                <Button variant="outline" className="border-[#CDA7B2] text-[#CDA7B2] hover:bg-[#CDA7B2] hover:text-white">
                  Browse More Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-[#967F71] mt-8">
          Need help? Contact us at{' '}
          <a href="mailto:kerrib@oceoluxe.com" className="text-[#CDA7B2] hover:underline">
            kerrib@oceoluxe.com
          </a>
        </p>
      </div>

      <MarketingFooter />
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#CDA7B2]" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
