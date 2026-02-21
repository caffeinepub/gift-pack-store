import ProductForm from './ProductForm';
import { useProductMutation } from '@/hooks/useProductMutation';
import { toast } from 'sonner';
import { useState } from 'react';
import type { BasketType, CategoryType, Size } from '@/backend';

export default function ProductManagement() {
  const { mutate: createProduct, isPending } = useProductMutation();
  const [formKey, setFormKey] = useState(0);

  const handleCreateProduct = (data: {
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
    createProduct(data, {
      onSuccess: () => {
        toast.success('Product created successfully!', {
          description: 'The new gift pack is now available in the catalog',
        });
        setFormKey((prev) => prev + 1); // Reset form
      },
      onError: (error) => {
        toast.error('Failed to create product', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      },
    });
  };

  return (
    <div>
      <h3 className="mb-4 font-serif text-lg font-semibold">Add New Gift Pack</h3>
      <ProductForm
        key={formKey}
        onSubmit={handleCreateProduct}
        isLoading={isPending}
      />
    </div>
  );
}
