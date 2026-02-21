import { useForm, Controller } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { BasketType, CategoryType, Size } from '@/backend';

interface ProductFormData {
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

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
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

const basketTypeOptions = [
  { value: BasketType.wickerBasket, label: 'Wicker Basket' },
  { value: BasketType.woodenCrate, label: 'Wooden Crate' },
  { value: BasketType.giftBox, label: 'Gift Box' },
];

const sizeOptions = [
  { value: Size.small, label: 'Small' },
  { value: Size.medium, label: 'Medium' },
  { value: Size.large, label: 'Large' },
];

export default function ProductForm({ onSubmit, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      discount: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Product ID */}
        <div className="space-y-2">
          <Label htmlFor="id">Product ID *</Label>
          <Input
            id="id"
            {...register('id', { required: 'Product ID is required' })}
            placeholder="e.g., gift-pack-14"
            disabled={isLoading}
          />
          {errors.id && (
            <p className="text-sm text-destructive">{errors.id.message}</p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., Deluxe Birthday Pack"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
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
            })}
            placeholder="e.g., 2999"
            disabled={isLoading}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        {/* Discount */}
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            {...register('discount', {
              min: { value: 0, message: 'Discount must be at least 0' },
              max: { value: 100, message: 'Discount cannot exceed 100' },
              valueAsNumber: true,
            })}
            placeholder="e.g., 10"
            disabled={isLoading}
            defaultValue={0}
          />
          {errors.discount && (
            <p className="text-sm text-destructive">{errors.discount.message}</p>
          )}
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL *</Label>
          <Input
            id="imageUrl"
            {...register('imageUrl', { required: 'Image URL is required' })}
            placeholder="https://example.com/image.jpg"
            disabled={isLoading}
          />
          {errors.imageUrl && (
            <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
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

        {/* Basket Type */}
        <div className="space-y-2">
          <Label htmlFor="basketType">Basket Type *</Label>
          <Controller
            name="basketType"
            control={control}
            rules={{ required: 'Basket type is required' }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select basket type" />
                </SelectTrigger>
                <SelectContent>
                  {basketTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.basketType && (
            <p className="text-sm text-destructive">{errors.basketType.message}</p>
          )}
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label htmlFor="size">Size *</Label>
          <Controller
            name="size"
            control={control}
            rules={{ required: 'Size is required' }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.size && (
            <p className="text-sm text-destructive">{errors.size.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Describe the gift pack..."
          rows={4}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-terracotta hover:bg-terracotta/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Product...
          </>
        ) : (
          'Create Product'
        )}
      </Button>
    </form>
  );
}
