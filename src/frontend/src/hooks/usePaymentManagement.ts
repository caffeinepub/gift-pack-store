import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RazorpayPayment } from '@/backend';
import { useMemo } from 'react';

export function usePaymentManagement() {
  const { actor, isFetching } = useActor();

  const query = useQuery<RazorpayPayment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllPayments();
    },
    enabled: !!actor && !isFetching,
  });

  const sortedPayments = useMemo(() => {
    if (!query.data) return [];
    // Sort by payment ID (most recent first - assuming payment IDs are chronological)
    return [...query.data].sort((a, b) => b.paymentId.localeCompare(a.paymentId));
  }, [query.data]);

  return {
    ...query,
    data: sortedPayments,
  };
}
