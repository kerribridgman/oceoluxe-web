'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart, AddToCartProduct } from '@/lib/cart';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  product: AddToCartProduct;
  quantity?: number;
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  showIcon = true,
  fullWidth = true,
}: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const inCart = isInCart(product.id, product.productSource);

  const handleAddToCart = () => {
    // Add item to cart (quantity times)
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }

    // Show success state
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-[#CDA7B2] hover:bg-[#c49aa5]'}
        text-white font-medium py-3 px-6 transition-all duration-200
        ${className}
      `}
    >
      {showIcon && (
        isAdded ? (
          <Check className="mr-2 h-5 w-5" />
        ) : (
          <ShoppingCart className="mr-2 h-5 w-5" />
        )
      )}
      {isAdded ? 'Added to Cart!' : inCart ? 'Add More' : 'Add to Cart'}
    </Button>
  );
}
