import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CouponFormData {
  code: string;
  discountPercentage: number;
  minDiscountPercentage?: number;
  maxDiscountAmount?: number;
  expirationDate: string;
  totalQuantity: number;
}

interface CouponFormProps {
  onSubmit: (data: CouponFormData) => void;
  isLoading?: boolean;
}

export default function CouponForm({ onSubmit, isLoading }: CouponFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CouponFormData>();

  const handleFormSubmit = (data: CouponFormData) => {
    onSubmit(data);
    reset();
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Coupon Code */}
        <div className="space-y-2">
          <Label htmlFor="code">Coupon Code *</Label>
          <Input
            id="code"
            {...register('code', {
              required: 'Coupon code is required',
              pattern: {
                value: /^[A-Z0-9]+$/,
                message: 'Only uppercase letters and numbers allowed',
              },
            })}
            placeholder="e.g., SAVE20"
            disabled={isLoading}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        {/* Discount Percentage */}
        <div className="space-y-2">
          <Label htmlFor="discountPercentage">Discount Percentage *</Label>
          <Input
            id="discountPercentage"
            type="number"
            {...register('discountPercentage', {
              required: 'Discount percentage is required',
              min: { value: 1, message: 'Discount must be at least 1%' },
              max: { value: 100, message: 'Discount cannot exceed 100%' },
              valueAsNumber: true,
            })}
            placeholder="e.g., 20"
            disabled={isLoading}
          />
          {errors.discountPercentage && (
            <p className="text-sm text-destructive">
              {errors.discountPercentage.message}
            </p>
          )}
        </div>

        {/* Minimum Discount Percentage */}
        <div className="space-y-2">
          <Label htmlFor="minDiscountPercentage">
            Minimum Discount Percentage (Optional)
          </Label>
          <Input
            id="minDiscountPercentage"
            type="number"
            {...register('minDiscountPercentage', {
              min: { value: 1, message: 'Minimum must be at least 1%' },
              max: { value: 100, message: 'Minimum cannot exceed 100%' },
              valueAsNumber: true,
            })}
            placeholder="e.g., 5"
            disabled={isLoading}
          />
          {errors.minDiscountPercentage && (
            <p className="text-sm text-destructive">
              {errors.minDiscountPercentage.message}
            </p>
          )}
        </div>

        {/* Maximum Discount Amount */}
        <div className="space-y-2">
          <Label htmlFor="maxDiscountAmount">
            Maximum Discount Amount (Optional)
          </Label>
          <Input
            id="maxDiscountAmount"
            type="number"
            {...register('maxDiscountAmount', {
              min: { value: 1, message: 'Maximum amount must be positive' },
              valueAsNumber: true,
            })}
            placeholder="e.g., 500"
            disabled={isLoading}
          />
          {errors.maxDiscountAmount && (
            <p className="text-sm text-destructive">
              {errors.maxDiscountAmount.message}
            </p>
          )}
        </div>

        {/* Total Quantity */}
        <div className="space-y-2">
          <Label htmlFor="totalQuantity">Total Quantity *</Label>
          <Input
            id="totalQuantity"
            type="number"
            {...register('totalQuantity', {
              required: 'Total quantity is required',
              min: { value: 1, message: 'Quantity must be at least 1' },
              valueAsNumber: true,
            })}
            placeholder="e.g., 100"
            disabled={isLoading}
          />
          {errors.totalQuantity && (
            <p className="text-sm text-destructive">
              {errors.totalQuantity.message}
            </p>
          )}
        </div>

        {/* Expiration Date */}
        <div className="space-y-2">
          <Label htmlFor="expirationDate">Expiration Date *</Label>
          <Input
            id="expirationDate"
            type="date"
            {...register('expirationDate', {
              required: 'Expiration date is required',
            })}
            min={minDate}
            disabled={isLoading}
          />
          {errors.expirationDate && (
            <p className="text-sm text-destructive">
              {errors.expirationDate.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-terracotta hover:bg-terracotta/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Coupon...
          </>
        ) : (
          'Create Coupon'
        )}
      </Button>
    </form>
  );
}
