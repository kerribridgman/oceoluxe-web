'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { CartItem, CartContextValue, AddToCartProduct } from './types';
import { saveCart, loadCart, clearCartStorage } from './cart-storage';

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' };

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: newItems, isOpen: true };
      }

      // Add new item
      return { ...state, items: [...state.items, action.payload], isOpen: true };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedItems = loadCart();
    if (savedItems.length > 0) {
      dispatch({ type: 'SET_ITEMS', payload: savedItems });
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    saveCart(state.items);
  }, [state.items]);

  const generateItemId = useCallback(
    (productId: number, productSource: 'dashboard' | 'notion'): string => {
      return `${productSource}-${productId}`;
    },
    []
  );

  const addItem = useCallback(
    (product: AddToCartProduct) => {
      const cartItem: CartItem = {
        id: generateItemId(product.id, product.productSource),
        productId: product.id,
        productSource: product.productSource,
        slug: product.slug,
        name: product.name,
        priceInCents: product.priceInCents,
        quantity: 1,
        coverImageUrl: product.coverImageUrl || undefined,
        productType: product.productType || 'one_time',
      };

      dispatch({ type: 'ADD_ITEM', payload: cartItem });
    },
    [generateItemId]
  );

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    clearCartStorage();
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const isInCart = useCallback(
    (productId: number, productSource: 'dashboard' | 'notion'): boolean => {
      const itemId = generateItemId(productId, productSource);
      return state.items.some((item) => item.id === itemId);
    },
    [state.items, generateItemId]
  );

  const getItemQuantity = useCallback(
    (productId: number, productSource: 'dashboard' | 'notion'): number => {
      const itemId = generateItemId(productId, productSource);
      const item = state.items.find((item) => item.id === itemId);
      return item?.quantity || 0;
    },
    [state.items, generateItemId]
  );

  const totalItems = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const totalPrice = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
  }, [state.items]);

  const value: CartContextValue = useMemo(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      isInCart,
      getItemQuantity,
    }),
    [
      state.items,
      state.isOpen,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      isInCart,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
