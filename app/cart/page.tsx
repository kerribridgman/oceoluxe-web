'use client';

import { useCart } from '@/lib/cart';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

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
                Looks like you haven't added any products yet. Explore our collection to find something you'll love.
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
          <Link href="/products" className="text-[#CDA7B2] hover:text-[#BD97A2] flex items-center gap-2 font-light text-sm">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-light text-[#3B3937] mb-8">
            Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-[#EDEBE8] bg-white overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#faf8f5]">
                          {item.coverImageUrl ? (
                            <Image
                              src={item.coverImageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-8 h-8 text-[#CDA7B2]/50" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Link href={`/products/${item.slug}`}>
                              <h3 className="font-medium text-[#3B3937] hover:text-[#CDA7B2] transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-[#967F71] mt-1">
                              {item.productType === 'subscription' ? 'Subscription' : 'Digital Product'}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#967F71] hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-full border border-[#EDEBE8] flex items-center justify-center text-[#967F71] hover:border-[#CDA7B2] hover:text-[#CDA7B2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-[#3B3937] font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-[#EDEBE8] flex items-center justify-center text-[#967F71] hover:border-[#CDA7B2] hover:text-[#CDA7B2] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-medium text-[#3B3937]">
                              {formatPrice(item.priceInCents * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-[#967F71]">
                                {formatPrice(item.priceInCents)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Clear Cart */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-[#967F71] hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-[#EDEBE8] bg-white sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif font-light text-[#3B3937] mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 pb-4 border-b border-[#EDEBE8]">
                    <div className="flex justify-between text-[#967F71]">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-[#967F71]">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between py-4 text-lg font-medium text-[#3B3937]">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>

                  <Link href="/checkout" className="block">
                    <Button className="w-full bg-[#CDA7B2] hover:bg-[#c49aa5] text-white py-6 text-lg">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <p className="text-xs text-[#967F71] text-center mt-4">
                    Secure checkout powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
