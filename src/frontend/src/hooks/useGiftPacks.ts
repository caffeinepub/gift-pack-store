import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GiftPack, CatalogFilters } from '@/backend';

export function useGiftPacks() {
  const { actor, isFetching } = useActor();

  return useQuery<GiftPack[]>({
    queryKey: ['giftPacks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGiftPacks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilteredGiftPacks(filters: CatalogFilters) {
  const { actor, isFetching } = useActor();

  return useQuery<GiftPack[]>({
    queryKey: ['giftPacks', 'filtered', filters],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterGiftPacks(filters);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGiftPackById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<GiftPack | null>({
    queryKey: ['giftPack', id],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getGiftPackById(id);
      return result;
    },
    enabled: !!actor && !isFetching && !!id && !id.startsWith('custom-'),
  });
}
