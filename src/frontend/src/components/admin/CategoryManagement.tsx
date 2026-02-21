import { useState } from 'react';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryMutation } from '@/hooks/useCategoryMutation';
import { toast } from 'sonner';
import type { Category } from '@/backend';

export default function CategoryManagement() {
  const { data: categories, isLoading } = useCategories();
  const { createCategory, updateCategory, isCreating, isUpdating } = useCategoryMutation();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSubmit = (data: { name: string; description: string }) => {
    if (editingCategory) {
      updateCategory(data, {
        onSuccess: () => {
          toast.success('Category Updated', {
            description: 'The category has been updated successfully',
          });
          setEditingCategory(null);
        },
        onError: (error) => {
          toast.error('Failed to update category', {
            description: error instanceof Error ? error.message : 'Please try again',
          });
        },
      });
    } else {
      createCategory(data, {
        onSuccess: () => {
          toast.success('Category Created', {
            description: 'The new category has been created successfully',
          });
        },
        onError: (error) => {
          toast.error('Failed to create category', {
            description: error instanceof Error ? error.message : 'Please try again',
          });
        },
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <div className="space-y-8">
      {/* Create/Edit Category Form */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </h3>
        <CategoryForm
          onSubmit={handleSubmit}
          isLoading={isCreating || isUpdating}
          editingCategory={editingCategory}
          mode={editingCategory ? 'edit' : 'create'}
          onCancel={handleCancelEdit}
        />
      </div>

      {/* Category List */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">Existing Categories</h3>
        <CategoryList
          categories={categories || []}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
