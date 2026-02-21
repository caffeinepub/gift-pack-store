import { useState } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { useProductMutation } from '@/hooks/useProductMutation';
import { toast } from 'sonner';
import type { CategoryType, Product } from '@/backend';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProductManagement() {
  const { createMutation, updateMutation, deleteMutation } = useProductMutation();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateProduct = (data: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: CategoryType;
    images: { url: string }[];
  }) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Product created successfully!', {
          description: 'The new product is now available for custom packages',
        });
        setShowForm(false);
      },
      onError: (error) => {
        toast.error('Failed to create product', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      },
    });
  };

  const handleUpdateProduct = (data: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: CategoryType;
    images: { url: string }[];
  }) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Product updated successfully!', {
          description: 'The product has been updated',
        });
        setEditingProduct(null);
        setShowForm(false);
      },
      onError: (error) => {
        toast.error('Failed to update product', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      },
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(productId, {
        onSuccess: () => {
          toast.success('Product deleted successfully!');
        },
        onError: (error) => {
          toast.error('Failed to delete product', {
            description: error instanceof Error ? error.message : 'Please try again',
          });
        },
      });
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-terracotta hover:bg-terracotta/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
      )}

      {showForm && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <ProductForm
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            isLoading={createMutation.isPending || updateMutation.isPending}
            initialData={editingProduct || undefined}
            onCancel={handleCancel}
          />
        </div>
      )}

      <ProductList
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
