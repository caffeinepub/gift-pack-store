import { useForm, Controller } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { BasketType, CategoryType, Size, type GiftPack } from '@/backend';

interface GiftPackFormData {
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

interface GiftPackFormProps {
  onSubmit: (data: GiftPackFormData) => void;
  isLoading?: boolean;
  editingGiftPack?: GiftPack | null;
  mode?: 'create' | 'edit';
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

export default function GiftPackForm({
  onSubmit,
  isLoading,
  editingGiftPack,
  mode = 'create',
  onCancel,
}: GiftPackFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<GiftPackFormData>({
    defaultValues: {
      discount: 0,
    },
  });

  useEffect(() => {
    if (editingGiftPack) {
      const imageUrl = editingGiftPack.images[0]?.getDirectURL() || '';
      reset({
        id: editingGiftPack.id,
        title: editingGiftPack.title,
        description: editingGiftPack.description,
        price: Number(editingGiftPack.price),
        discount: Number(editingGiftPack.discount),
        category: editingGiftPack.category,
        imageUrl,
        basketType: editingGiftPack.basketType,
        size: editingGiftPack.size,
      });
    } else {
      reset({
        id: '',
        title: '',
        description: '',
        price: 0,
        discount: 0,
        category: undefined,
        imageUrl: '',
        basketType: undefined,
        size: undefined,
      });
    }
  }, [editingGiftPack, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pack ID */}
        <div className="space-y-2">
          <Label htmlFor="id">Pack ID *</Label>
          <Input
            id="id"
            {...register('id', { required: 'Pack ID is required' })}
            placeholder="e.g., gift-pack-15"
            disabled={isLoading || mode === 'edit'}
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
            placeholder="e.g., Premium Celebration Pack"
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
            placeholder="e.g., 3499"
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
            placeholder="e.g., 15"
            disabled={isLoading}
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
            placeholder="https://example.com/gift-pack.jpg"
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
            'Update Gift Pack'
          ) : (
            'Create Gift Pack'
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
