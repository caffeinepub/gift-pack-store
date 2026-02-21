import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '@/backend';
import type { BasketType, CategoryType, Size } from '@/backend';

interface GiftPackData {
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

export function useGiftPackMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const createGiftPack = useMutation({
    mutationFn: async (data: GiftPackData) => {
      if (!actor) throw new Error('Actor not initialized');

      const priceBigInt = BigInt(data.price);
      const discountBigInt = BigInt(data.discount || 0);
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

  const updateGiftPack = useMutation({
    mutationFn: async (data: GiftPackData) => {
      if (!actor) throw new Error('Actor not initialized');

      const priceBigInt = BigInt(data.price);
      const discountBigInt = BigInt(data.discount || 0);
      const images = data.imageUrl ? [ExternalBlob.fromURL(data.imageUrl)] : [];

      return actor.updateProduct(
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

  return {
    createGiftPack: createGiftPack.mutate,
    updateGiftPack: updateGiftPack.mutate,
    isCreating: createGiftPack.isPending,
    isUpdating: updateGiftPack.isPending,
  };
}
