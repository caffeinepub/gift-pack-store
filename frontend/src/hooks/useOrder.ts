import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order, CartItem, DeliveryAddress, BasketType, Size, PackType } from '@/backend';

interface CreateOrderParams {
  userId: string;
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  totalAmount: bigint;
  basketType: BasketType;
  size: Size;
  packingType: PackType;
  messageCard: string | null;
  paymentId: string;
  couponCode?: string | null;
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CreateOrderParams>({
    mutationFn: async (params) => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.createOrder(
        params.userId,
        params.items,
        params.deliveryAddress,
        params.totalAmount,
        params.basketType,
        params.size,
        params.packingType,
        params.messageCard,
        params.paymentId,
        params.couponCode ?? null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
    },
  });
}

// Export as useOrder for backward compatibility
export const useOrder = useCreateOrder;
