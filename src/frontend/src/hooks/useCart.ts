import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CartItem, GiftPack, Coupon } from '@/backend';
import { BasketType, Size, PackType } from '@/backend';
import { calculateCouponDiscount } from './useCoupon';

interface CartState {
  items: CartItem[];
}

export function useCart() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [cart, setCart] = useState<CartState>({ items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart, (key, value) => {
          if (key === 'quantity' && typeof value === 'string') {
            return BigInt(value);
          }
          return value;
        });
        setCart(parsed);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'cart',
      JSON.stringify(cart, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
  }, [cart]);

  const syncCartFromBackend = async () => {
    if (!actor || !identity) return;

    try {
      const backendCart = await actor.getCart();
      if (backendCart && backendCart.items.length > 0) {
        setCart({ items: backendCart.items });
      } else if (cart.items.length > 0) {
        await actor.saveCart({
          items: cart.items,
          userId: identity.getPrincipal().toString(),
          basketType: BasketType.wickerBasket,
          size: Size.medium,
          packingType: PackType.wrapStyle1,
          messageCard: undefined,
        });
      }
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
    }
  };

  const clearCartCompletely = () => {
    setCart({ items: [] });
    localStorage.removeItem('cart');
  };

  const addItem = (item: CartItem) => {
    setCart((prev) => {
      const existingItemIndex = prev.items.findIndex(
        (i) => i.packId === item.packId
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...prev.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity,
        };
      } else {
        newItems = [...prev.items, item];
      }

      return { items: newItems };
    });
  };

  const updateQuantity = async (packId: string, quantity: bigint) => {
    if (quantity <= 0n) {
      removeItem(packId);
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        item.packId === packId ? { ...item, quantity } : item
      );
      return { items: newItems };
    });

    if (actor && identity) {
      try {
        await actor.updateCartItemQuantity(packId, quantity);
      } catch (error) {
        console.error('Failed to update cart item quantity in backend:', error);
      }
    }
  };

  const removeItem = (packId: string) => {
    setCart((prev) => ({
      items: prev.items.filter((item) => item.packId !== packId),
    }));
  };

  const clearCart = async () => {
    setCart({ items: [] });
    if (actor && identity) {
      try {
        await actor.clearCart();
      } catch (error) {
        console.error('Failed to clear cart in backend:', error);
      }
    }
  };

  const calculateTotals = (giftPacks: GiftPack[], coupon: Coupon | null = null) => {
    let subtotal = 0;

    cart.items.forEach((item) => {
      const pack = giftPacks.find((p) => p.id === item.packId);
      if (pack) {
        const discount = Number(pack.discount);
        const originalPrice = Number(pack.price);
        const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
        subtotal += discountedPrice * Number(item.quantity);
      }
    });

    subtotal = Math.round(subtotal);

    const couponDiscount = calculateCouponDiscount(subtotal, coupon);
    const subtotalAfterCoupon = subtotal - couponDiscount;
    const tax = Math.round(subtotalAfterCoupon * 0.18);
    const total = subtotalAfterCoupon + tax;

    return {
      subtotal,
      couponDiscount,
      tax,
      total,
    };
  };

  const itemCount = cart.items.reduce((sum, item) => sum + Number(item.quantity), 0);

  return {
    items: cart.items,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    calculateTotals,
    syncCartFromBackend,
    clearCartCompletely,
  };
}
