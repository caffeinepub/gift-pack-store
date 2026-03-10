import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '@/backend';

export function useCustomProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['customProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}
