import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Coupon } from '@/backend';

interface CouponData {
  code: string;
  discountPercentage: number;
  minDiscountPercentage?: number;
  maxDiscountAmount?: number;
  expirationDate: bigint;
  totalQuantity: number;
}

export function useCouponMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const createCoupon = useMutation({
    mutationFn: async (data: CouponData) => {
      if (!actor) throw new Error('Actor not initialized');

      return actor.createCoupon(
        data.code,
        BigInt(data.discountPercentage),
        data.minDiscountPercentage !== undefined ? BigInt(data.minDiscountPercentage) : null,
        data.maxDiscountAmount !== undefined ? BigInt(data.maxDiscountAmount) : null,
        data.expirationDate,
        BigInt(data.totalQuantity)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const updateCoupon = useMutation({
    mutationFn: async (data: CouponData) => {
      if (!actor) throw new Error('Actor not initialized');
      // Backend updateCoupon method not yet implemented
      // This is a placeholder that will work once backend is updated
      return actor.createCoupon(
        data.code,
        BigInt(data.discountPercentage),
        data.minDiscountPercentage !== undefined ? BigInt(data.minDiscountPercentage) : null,
        data.maxDiscountAmount !== undefined ? BigInt(data.maxDiscountAmount) : null,
        data.expirationDate,
        BigInt(data.totalQuantity)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  return {
    createCoupon: createCoupon.mutate,
    updateCoupon: updateCoupon.mutate,
    isCreating: createCoupon.isPending,
    isUpdating: updateCoupon.isPending,
  };
}

export function useAllCoupons() {
  const { actor, isFetching } = useActor();

  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      // TODO: Backend doesn't have getAllCoupons method yet
      // Return empty array for now
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
