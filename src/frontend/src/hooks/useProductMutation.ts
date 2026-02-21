import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '@/backend';
import type { BasketType, CategoryType, Size } from '@/backend';

interface CreateProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  category: CategoryType;
  imageUrl: string;
  basketType: BasketType;
  size: Size;
}

export function useProductMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      if (!actor) throw new Error('Actor not initialized');

      // Convert price and discount to BigInt
      const priceBigInt = BigInt(data.price);
      const discountBigInt = BigInt(data.discount || 0);

      // Create ExternalBlob array from image URL
      const images = data.imageUrl ? [ExternalBlob.fromURL(data.imageUrl)] : [];

      return actor.createProduct(
        data.id,
        data.title,
        data.description,
        priceBigInt,
        discountBigInt,
        data.category,
        images,
        data.basketType,
        data.size
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftPacks'] });
      queryClient.invalidateQueries({ queryKey: ['giftPacks', 'filtered'] });
    },
  });
}
