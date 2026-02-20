import { useState, useEffect } from 'react';
import type { CartItem } from '@/backend';

const CART_STORAGE_KEY = 'giftpack-cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.packId === item.packId && i.customMessage === item.customMessage
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (packId: string, quantity: bigint) => {
    setItems((prev) =>
      prev.map((item) => (item.packId === packId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (packId: string) => {
    setItems((prev) => prev.filter((item) => item.packId !== packId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  // Calculate totals (mock prices for custom packs)
  const subtotal = items.reduce((sum, item) => {
    // For custom packs, use a base price
    const price = item.packId.startsWith('custom-') ? 1999 : 0;
    return sum + price * Number(item.quantity);
  }, 0);

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return {
    items,
    itemCount,
    subtotal,
    tax,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
