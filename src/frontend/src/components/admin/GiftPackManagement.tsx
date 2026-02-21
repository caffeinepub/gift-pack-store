import { useState } from 'react';
import GiftPackForm from './GiftPackForm';
import GiftPackList from './GiftPackList';
import { useGiftPackMutation } from '@/hooks/useGiftPackMutation';
import type { BasketType, CategoryType, Size, GiftPack } from '@/backend';

export default function GiftPackManagement() {
  const { createGiftPack, updateGiftPack, deleteGiftPack, isCreating, isUpdating, isDeleting } = useGiftPackMutation();
  const [editingGiftPack, setEditingGiftPack] = useState<GiftPack | null>(null);

  const handleSubmit = (data: {
    id: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    category: CategoryType;
    images: { url: string }[];
    basketType: BasketType;
    size: Size;
  }) => {
    if (editingGiftPack) {
      updateGiftPack(data);
      setEditingGiftPack(null);
    } else {
      createGiftPack(data);
    }
  };

  const handleEdit = (giftPack: GiftPack) => {
    setEditingGiftPack(giftPack);
  };

  const handleDelete = (id: string) => {
    deleteGiftPack(id);
  };

  const handleCancelEdit = () => {
    setEditingGiftPack(null);
  };

  return (
    <div className="space-y-8">
      {/* Create/Edit Gift Pack Form */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">
          {editingGiftPack ? 'Edit Gift Pack' : 'Create New Gift Pack'}
        </h3>
        <GiftPackForm
          onSubmit={handleSubmit}
          isLoading={isCreating || isUpdating}
          editingGiftPack={editingGiftPack}
          mode={editingGiftPack ? 'edit' : 'create'}
          onCancel={handleCancelEdit}
        />
      </div>

      {/* Gift Pack List */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">Existing Gift Packs</h3>
        <GiftPackList
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
