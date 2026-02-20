import { useState, useEffect } from 'react';
import type { CartItem, GiftPack } from '@/backend';
import { useActor } from './useActor';

const CART_STORAGE_KEY = 'giftpack-cart';

// Custom serializer for BigInt
function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

// Custom deserializer for BigInt
function deserializeCart(data: string): CartItem[] {
  return JSON.parse(data, (key, value) => {
    if (key === 'quantity' && typeof value === 'string') {
      return BigInt(value);
    }
    return value;
  });
}

export function useCart() {
  const { actor } = useActor();
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];
      return deserializeCart(stored);
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      const serialized = serializeCart(items);
      localStorage.setItem(CART_STORAGE_KEY, serialized);
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    if (!item.packId) {
      console.error('Cannot add item without packId');
      return;
    }

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
    if (quantity < BigInt(1)) {
      console.warn('Quantity must be at least 1');
      return;
    }
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

  const clearCartCompletely = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
    }
  };

  const syncCartFromBackend = async () => {
    if (!actor) {
      console.warn('Actor not available for cart sync');
      return [];
    }

    try {
      const backendCart = await actor.getCart();
      if (backendCart) {
        // Convert backend cart items to local cart format
        const syncedItems: CartItem[] = backendCart.items.map((item) => ({
          packId: item.packId,
          quantity: item.quantity,
          customMessage: item.customMessage,
          wrappingOption: item.wrappingOption,
        }));

        setItems(syncedItems);
        
        try {
          const serialized = serializeCart(syncedItems);
          localStorage.setItem(CART_STORAGE_KEY, serialized);
          window.dispatchEvent(new Event('cart-updated'));
        } catch (error) {
          console.error('Failed to save synced cart to localStorage:', error);
        }

        return syncedItems;
      } else {
        // No cart in backend, keep local cart
        return items;
      }
    } catch (error) {
      console.error('Failed to sync cart from backend:', error);
      return items;
    }
  };

  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  // Calculate totals with gift pack data
  const calculateTotals = (giftPacks: GiftPack[]) => {
    const subtotal = items.reduce((sum, item) => {
      // Find the gift pack for this cart item
      const pack = giftPacks.find((p) => p.id === item.packId);
      if (pack) {
        return sum + Number(pack.price) * Number(item.quantity);
      }
      // For custom packs or missing packs, use a base price
      return sum + 1999 * Number(item.quantity);
    }, 0);

    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  return {
    items,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    clearCartCompletely,
    syncCartFromBackend,
    calculateTotals,
  };
}
