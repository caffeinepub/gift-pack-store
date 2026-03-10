import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Category } from '@/backend';

export function useCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}
