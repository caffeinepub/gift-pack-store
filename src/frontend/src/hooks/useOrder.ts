import { useMutation } from '@tanstack/react-query';
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
}

export function useCreateOrder() {
  const { actor } = useActor();

  return useMutation<Order, Error, CreateOrderParams>({
    mutationFn: async ({ userId, items, deliveryAddress, totalAmount, basketType, size, packingType, messageCard }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createOrder(userId, items, deliveryAddress, totalAmount, basketType, size, packingType, messageCard);
    },
  });
}

// Export as default for backward compatibility
export { useCreateOrder as useOrder };
