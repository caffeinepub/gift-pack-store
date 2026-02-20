import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order } from '@/backend';

export function useOrderHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orderHistory'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const orders = await actor.getOrderHistory();
        return orders;
      } catch (error) {
        console.error('Failed to fetch order history:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
