import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';

export default function OrderSummary() {
  const { items, subtotal, tax, total } = useCart();

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
