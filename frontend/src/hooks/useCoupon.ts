import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Coupon } from '@/backend';

export function useCouponValidation() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string): Promise<Coupon | null> => {
      if (!actor) throw new Error('Actor not initialized');
      
      const upperCode = code.toUpperCase().trim();
      const result = await actor.validateCoupon(upperCode);
      
      return result;
    },
  });
}

export function calculateCouponDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon) return 0;
  
  const discountPercentage = Number(coupon.discountPercentage);
  return Math.round(subtotal * discountPercentage / 100);
}
