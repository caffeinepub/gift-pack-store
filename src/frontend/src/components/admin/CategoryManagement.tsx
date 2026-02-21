import { useState } from 'react';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryMutation } from '@/hooks/useCategoryMutation';
import { toast } from 'sonner';

export default function CategoryManagement() {
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending } = useCategoryMutation();
  const [formKey, setFormKey] = useState(0);

  const handleCreateCategory = (data: { name: string; description: string }) => {
    createCategory(data, {
      onSuccess: () => {
        toast.success('Category created successfully!');
        setFormKey((prev) => prev + 1); // Reset form
      },
      onError: (error) => {
        toast.error('Failed to create category', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Create Category Form */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">Create New Category</h3>
        <CategoryForm
          key={formKey}
          onSubmit={handleCreateCategory}
          isLoading={isPending}
        />
      </div>

      {/* Category List */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">Existing Categories</h3>
        <CategoryList categories={categories || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
