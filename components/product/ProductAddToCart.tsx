'use client';

import { useState } from 'react';
import { QuantitySelector } from './QuantitySelector';
import { AddToCartButton } from './AddToCartButton';
import { ProductTrustBadges } from './ProductTrustBadges';
import { AddToCartProduct } from '@/lib/cart';

interface ProductAddToCartProps {
  product: AddToCartProduct;
  priceDisplay: string;
}

export function ProductAddToCart({ product, priceDisplay }: ProductAddToCartProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="text-3xl font-serif font-light text-[#3B3937]">
        {priceDisplay}
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-4">
        <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
        <AddToCartButton product={product} quantity={quantity} />
      </div>

      {/* Trust Badges */}
      <ProductTrustBadges />
    </div>
  );
}
