import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Coupon } from '@/backend';
import { Calendar, Percent, Package, TrendingDown, TrendingUp } from 'lucide-react';

interface CouponListProps {
  coupons: Coupon[];
  isLoading?: boolean;
}

export default function CouponList({ coupons, isLoading }: CouponListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No coupons created yet</p>
        </CardContent>
      </Card>
    );
  }

  const isExpired = (expirationDate: bigint) => {
    const now = BigInt(Date.now()) * BigInt(1000000); // Convert to nanoseconds
    return now > expirationDate;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => {
        const expired = isExpired(coupon.expirationDate);
        const soldOut = Number(coupon.remainingQuantity) === 0;
        const expirationDateMs = Number(coupon.expirationDate) / 1000000;
        const formattedDate = new Date(expirationDateMs).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        return (
          <Card key={coupon.code} className={expired || soldOut ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="font-mono text-lg">{coupon.code}</CardTitle>
                <Badge variant={expired || soldOut ? 'secondary' : 'default'}>
                  {soldOut ? 'Sold Out' : expired ? 'Expired' : 'Active'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-terracotta">
                  {Number(coupon.discountPercentage)}% OFF
                </span>
              </div>

              {coupon.minDiscountPercentage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingDown className="h-4 w-4" />
                  <span>Min: {Number(coupon.minDiscountPercentage)}%</span>
                </div>
              )}

              {coupon.maxDiscountAmount && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Max: ₹{Number(coupon.maxDiscountAmount)}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>
                  {Number(coupon.remainingQuantity)}/{Number(coupon.totalQuantity)} remaining
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Expires: {formattedDate}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
