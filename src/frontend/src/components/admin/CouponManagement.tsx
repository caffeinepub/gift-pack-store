import { useState } from 'react';
import CouponForm from './CouponForm';
import CouponList from './CouponList';
import { useCouponMutation, useAllCoupons } from '@/hooks/useCouponMutation';
import { toast } from 'sonner';

export default function CouponManagement() {
  const { mutate: createCoupon, isPending } = useCouponMutation();
  const { data: coupons = [], isLoading } = useAllCoupons();

  const handleSubmit = (data: {
    code: string;
    discountPercentage: number;
    minDiscountPercentage?: number;
    maxDiscountAmount?: number;
    expirationDate: string;
    totalQuantity: number;
  }) => {
    // Convert date to nanoseconds timestamp
    const expirationDate = BigInt(new Date(data.expirationDate).getTime()) * BigInt(1000000);

    createCoupon(
      {
        code: data.code,
        discountPercentage: data.discountPercentage,
        minDiscountPercentage: data.minDiscountPercentage,
        maxDiscountAmount: data.maxDiscountAmount,
        expirationDate,
        totalQuantity: data.totalQuantity,
      },
      {
        onSuccess: () => {
          toast.success('Coupon created successfully!');
        },
        onError: (error) => {
          console.error('Failed to create coupon:', error);
          toast.error('Failed to create coupon. Please try again.');
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-serif text-xl font-semibold">Create New Coupon</h3>
        <CouponForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>

      <div>
        <h3 className="mb-4 font-serif text-xl font-semibold">Existing Coupons</h3>
        <CouponList coupons={coupons} isLoading={isLoading} />
      </div>
    </div>
  );
}
