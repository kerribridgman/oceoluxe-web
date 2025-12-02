import { CartItem } from './types';

const CART_STORAGE_KEY = 'oceoluxe-cart';

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const items = JSON.parse(stored);
    // Validate that items is an array
    if (!Array.isArray(items)) return [];

    return items;
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
}

export function clearCartStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
}
