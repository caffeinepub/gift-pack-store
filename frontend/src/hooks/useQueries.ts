import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useInitializeData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.initialize();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftPacks'] });
    },
  });
}
