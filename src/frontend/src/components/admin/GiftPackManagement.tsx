import { useState } from 'react';
import GiftPackForm from './GiftPackForm';
import GiftPackList from './GiftPackList';
import { useGiftPacks } from '@/hooks/useGiftPacks';
import { useProductMutation } from '@/hooks/useProductMutation';
import { toast } from 'sonner';
import type { BasketType, CategoryType, Size } from '@/backend';

export default function GiftPackManagement() {
  const { data: giftPacks, isLoading } = useGiftPacks();
  const { mutate: createGiftPack, isPending } = useProductMutation();
  const [formKey, setFormKey] = useState(0);

  const handleCreateGiftPack = (data: {
    id: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    category: CategoryType;
    imageUrl: string;
    basketType: BasketType;
    size: Size;
  }) => {
    createGiftPack(data, {
      onSuccess: () => {
        toast.success('Gift pack created successfully!', {
          description: 'The new gift pack is now available in the catalog',
        });
        setFormKey((prev) => prev + 1); // Reset form
      },
      onError: (error) => {
        toast.error('Failed to create gift pack', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Create Gift Pack Form */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">Create New Gift Pack</h3>
        <GiftPackForm
          key={formKey}
          onSubmit={handleCreateGiftPack}
          isLoading={isPending}
        />
      </div>

      {/* Gift Pack List */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">Existing Gift Packs</h3>
        <GiftPackList giftPacks={giftPacks || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
