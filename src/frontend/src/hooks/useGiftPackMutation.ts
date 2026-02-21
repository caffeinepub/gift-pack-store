import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '@/backend';
import type { BasketType, CategoryType, Size } from '@/backend';
import { toast } from 'sonner';

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

  const createGiftPackMutation = useMutation({
    mutationFn: async (data: GiftPackData) => {
      if (!actor) throw new Error('Actor not initialized');

      const priceBigInt = BigInt(data.price);
      const discountBigInt = BigInt(data.discount);

      return actor.createGiftPack(
        data.id,
        data.title,
        data.description,
        priceBigInt,
        discountBigInt,
        data.category,
        [], // items - empty array for now
        [], // images - empty array for now
        data.basketType,
        data.size
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftPacks'] });
      queryClient.invalidateQueries({ queryKey: ['giftPacks', 'filtered'] });
      toast.success('Gift Pack Created', {
        description: 'The new gift pack is now available in the catalog',
      });
    },
    onError: (error) => {
      toast.error('Failed to create gift pack', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    },
  });

  const updateGiftPackMutation = useMutation({
    mutationFn: async (data: GiftPackData) => {
      if (!actor) throw new Error('Actor not initialized');

      const priceBigInt = BigInt(data.price);
      const discountBigInt = BigInt(data.discount);

      return actor.updateGiftPack(
        data.id,
        data.title,
        data.description,
        priceBigInt,
        discountBigInt,
        data.category,
        [], // items - empty array for now
        [], // images - empty array for now
        data.basketType,
        data.size
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftPacks'] });
      queryClient.invalidateQueries({ queryKey: ['giftPacks', 'filtered'] });
      toast.success('Gift Pack Updated', {
        description: 'The gift pack has been updated successfully',
      });
    },
    onError: (error) => {
      toast.error('Failed to update gift pack', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    },
  });

  const deleteGiftPackMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteGiftPack(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftPacks'] });
      queryClient.invalidateQueries({ queryKey: ['giftPacks', 'filtered'] });
      toast.success('Gift Pack Deleted', {
        description: 'The gift pack has been removed successfully',
      });
    },
    onError: (error) => {
      toast.error('Failed to delete gift pack', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    },
  });

  return {
    createGiftPack: createGiftPackMutation.mutate,
    updateGiftPack: updateGiftPackMutation.mutate,
    deleteGiftPack: deleteGiftPackMutation.mutate,
    isCreating: createGiftPackMutation.isPending,
    isUpdating: updateGiftPackMutation.isPending,
    isDeleting: deleteGiftPackMutation.isPending,
  };
}
