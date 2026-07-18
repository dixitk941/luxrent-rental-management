'use client';

// Lightweight localStorage-backed cart, shared across storefront pages.

export interface CartItem {
  key: string;         // unique per line
  productId: number;
  title: string;
  attachment: string;
  attachmentPrice: number;
  days: number;
  rate: number;
  deposit: number;
  image: string;
  pickup: string;
  returnDate: string;
}

const KEY = 'luxrent.cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function setCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:changed'));
}

export function addToCart(item: Omit<CartItem, 'key'>) {
  const items = getCart();
  items.push({ ...item, key: `${item.productId}-${Date.now()}` });
  setCart(items);
}

export function removeFromCart(key: string) {
  setCart(getCart().filter((i) => i.key !== key));
}

export function clearCart() {
  setCart([]);
}

export function cartCount(): number {
  return getCart().length;
}
