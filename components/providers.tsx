'use client';

import { CartProvider } from '@/lib/cart';
import { CartDrawer } from '@/components/cart';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
