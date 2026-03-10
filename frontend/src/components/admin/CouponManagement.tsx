import { useState } from 'react';
import CouponForm from './CouponForm';
import CouponList from './CouponList';
import { useCouponMutation, useAllCoupons } from '@/hooks/useCouponMutation';
import { toast } from 'sonner';
import type { Coupon } from '@/backend';

export default function CouponManagement() {
  const { createCoupon, updateCoupon, isCreating, isUpdating } = useCouponMutation();
  const { data: coupons = [], isLoading } = useAllCoupons();
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleSubmit = (data: {
    code: string;
    discountPercentage: number;
    minDiscountPercentage?: number;
    maxDiscountAmount?: number;
    expirationDate: string;
    totalQuantity: number;
  }) => {
    const expirationDate = BigInt(new Date(data.expirationDate).getTime()) * BigInt(1000000);

    const couponData = {
      code: data.code,
      discountPercentage: data.discountPercentage,
      minDiscountPercentage: data.minDiscountPercentage,
      maxDiscountAmount: data.maxDiscountAmount,
      expirationDate,
      totalQuantity: data.totalQuantity,
    };

    if (editingCoupon) {
      updateCoupon(couponData, {
        onSuccess: () => {
          toast.success('Coupon Updated', {
            description: 'The coupon has been updated successfully',
          });
          setEditingCoupon(null);
        },
        onError: (error) => {
          console.error('Failed to update coupon:', error);
          toast.error('Failed to update coupon. Please try again.');
        },
      });
    } else {
      createCoupon(couponData, {
        onSuccess: () => {
          toast.success('Coupon Created', {
            description: 'The new coupon has been created successfully',
          });
        },
        onError: (error) => {
          console.error('Failed to create coupon:', error);
          toast.error('Failed to create coupon. Please try again.');
        },
      });
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
  };

  const handleCancelEdit = () => {
    setEditingCoupon(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-serif text-xl font-semibold">
          {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
        </h3>
        <CouponForm
          onSubmit={handleSubmit}
          isLoading={isCreating || isUpdating}
          editingCoupon={editingCoupon}
          mode={editingCoupon ? 'edit' : 'create'}
          onCancel={handleCancelEdit}
        />
      </div>

      <div>
        <h3 className="mb-4 font-serif text-xl font-semibold">Existing Coupons</h3>
        <CouponList coupons={coupons} isLoading={isLoading} onEdit={handleEdit} />
      </div>
    </div>
  );
}
