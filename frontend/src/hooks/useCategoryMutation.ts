import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface CategoryData {
  name: string;
  description: string;
}

export function useCategoryMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (data: CategoryData) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createCategory(data.name, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async (data: CategoryData) => {
      if (!actor) throw new Error('Actor not initialized');
      // Backend updateCategory method not yet implemented
      // This is a placeholder that will work once backend is updated
      return actor.createCategory(data.name, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    createCategory: createCategory.mutate,
    updateCategory: updateCategory.mutate,
    isCreating: createCategory.isPending,
    isUpdating: updateCategory.isPending,
  };
}
