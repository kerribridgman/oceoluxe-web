'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';

interface CartIconProps {
  isScrolled?: boolean;
}

export function CartIcon({ isScrolled = false }: CartIconProps) {
  const { totalItems, toggleCart } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`relative h-10 w-10 ${isScrolled ? 'hover:bg-white/20' : ''}`}
      onClick={toggleCart}
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <ShoppingCart className={`h-5 w-5 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-[#3B3937]'}`} />
      {totalItems > 0 && (
        <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium ${
          isScrolled ? 'bg-white text-[#CDA7B2]' : 'bg-[#CDA7B2] text-white'
        }`}>
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Button>
  );
}
