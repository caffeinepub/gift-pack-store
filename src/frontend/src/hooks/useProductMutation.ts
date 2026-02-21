import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CategoryType } from '@/backend';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  imageUrl: string;
}

export function useProductMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: ProductData) => {
      if (!actor) throw new Error('Actor not initialized');

      const priceBigInt = BigInt(data.price);

      return actor.createProduct(
        data.id,
        data.name,
        data.description,
        priceBigInt,
        data.category,
        data.imageUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customProducts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductData) => {
      if (!actor) throw new Error('Actor not initialized');

      const priceBigInt = BigInt(data.price);

      return actor.updateProduct(
        data.id,
        data.name,
        data.description,
        priceBigInt,
        data.category,
        data.imageUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customProducts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Note: Backend doesn't have a delete method yet, so this is a placeholder
      // The backend will need to implement deleteProduct method
      throw new Error('Delete functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customProducts'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
