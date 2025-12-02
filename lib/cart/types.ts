export interface CartItem {
  id: string; // unique cart item id (productId-productSource)
  productId: number;
  productSource: 'dashboard' | 'notion';
  slug: string;
  name: string;
  priceInCents: number;
  quantity: number;
  coverImageUrl?: string;
  productType: 'one_time' | 'subscription';
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number; // in cents
  addItem: (product: AddToCartProduct) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isInCart: (productId: number, productSource: 'dashboard' | 'notion') => boolean;
  getItemQuantity: (productId: number, productSource: 'dashboard' | 'notion') => number;
}

// Product shape when adding to cart
export interface AddToCartProduct {
  id: number;
  productSource: 'dashboard' | 'notion';
  slug: string;
  name: string;
  priceInCents: number;
  coverImageUrl?: string | null;
  productType?: 'one_time' | 'subscription';
}
