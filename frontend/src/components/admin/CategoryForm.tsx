import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Category } from '@/backend';

interface CategoryFormData {
  name: string;
  description: string;
}

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
  editingCategory?: Category | null;
  mode?: 'create' | 'edit';
  onCancel?: () => void;
}

export default function CategoryForm({
  onSubmit,
  isLoading,
  editingCategory,
  mode = 'create',
  onCancel,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>();

  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        description: editingCategory.description,
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [editingCategory, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Category name is required' })}
          placeholder="e.g., Premium Gifts"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Brief description of this category"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-terracotta hover:bg-terracotta/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'edit' ? 'Updating...' : 'Creating...'}
            </>
          ) : mode === 'edit' ? (
            'Update Category'
          ) : (
            'Create Category'
          )}
        </Button>
        {mode === 'edit' && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
