import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useGiftPacks } from '@/hooks/useGiftPacks';
import { Skeleton } from '@/components/ui/skeleton';
import type { Coupon } from '@/backend';

interface OrderSummaryProps {
  coupon?: Coupon | null;
}

export default function OrderSummary({ coupon = null }: OrderSummaryProps) {
  const { items, calculateTotals } = useCart();
  const { data: giftPacks, isLoading } = useGiftPacks();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Separator />
          <Skeleton className="h-16 w-full" />
          <Separator />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { subtotal, couponDiscount, tax, total } = calculateTotals(giftPacks || [], coupon);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold">Items ({items.length})</p>
          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.packId} × {Number(item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          
          {coupon && couponDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Coupon ({coupon.code})
              </span>
              <span className="font-medium text-sage">
                -₹{couponDiscount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST (18%)</span>
            <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-serif text-2xl font-bold text-terracotta">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
