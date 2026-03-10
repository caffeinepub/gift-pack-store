import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, X } from 'lucide-react';
import { CategoryType, type Product } from '@/backend';

interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  images: { url: string }[];
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
  initialData?: Product;
  onCancel?: () => void;
}

const categoryOptions = [
  { value: CategoryType.birthday, label: 'Birthday' },
  { value: CategoryType.anniversary, label: 'Anniversary' },
  { value: CategoryType.corporate, label: 'Corporate' },
  { value: CategoryType.festive, label: 'Festive' },
  { value: CategoryType.sympathy, label: 'Sympathy' },
  { value: CategoryType.wellness, label: 'Wellness' },
  { value: CategoryType.custom, label: 'Custom' },
];

export default function ProductForm({ onSubmit, isLoading, initialData, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: initialData
      ? {
          id: initialData.id,
          name: initialData.name,
          description: initialData.description,
          price: Number(initialData.price),
          category: initialData.category,
          images: initialData.images.map((url) => ({ url })),
        }
      : {
          images: [{ url: '' }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description,
        price: Number(initialData.price),
        category: initialData.category,
        images: initialData.images.map((url) => ({ url })),
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Product ID */}
        <div className="space-y-2">
          <Label htmlFor="id">Product ID *</Label>
          <Input
            id="id"
            {...register('id', { required: 'Product ID is required' })}
            placeholder="e.g., chocolate-box-01"
            disabled={isLoading || !!initialData}
          />
          {errors.id && (
            <p className="text-sm text-destructive">{errors.id.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Product name is required' })}
            placeholder="e.g., Premium Chocolate Box"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' },
              valueAsNumber: true,
            })}
            placeholder="e.g., 499"
            disabled={isLoading}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Describe the product..."
          rows={4}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Image URLs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Image URLs *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ url: '' })}
            disabled={isLoading}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Image
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  {...register(`images.${index}.url`, {
                    required: 'Image URL is required',
                  })}
                  placeholder="https://example.com/image.jpg"
                  disabled={isLoading}
                />
                {errors.images?.[index]?.url && (
                  <p className="text-sm text-destructive">
                    {errors.images[index]?.url?.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                disabled={isLoading || fields.length === 1}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {errors.images && (
          <p className="text-sm text-destructive">At least one image is required</p>
        )}
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
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{initialData ? 'Update Product' : 'Create Product'}</>
          )}
        </Button>
        {onCancel && (
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
