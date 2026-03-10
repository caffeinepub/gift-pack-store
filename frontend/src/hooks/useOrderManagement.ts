import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order, OrderStatus } from '@/backend';
import { toast } from 'sonner';

export function useAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const orders = await actor.adminViewAllOrders();
      // Sort by creation date (newest first)
      return orders.sort((a, b) => {
        const timeA = Number(a.createdAt);
        const timeB = Number(b.createdAt);
        return timeB - timeA;
      });
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.adminUpdateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update order status', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    },
  });
}
