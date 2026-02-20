import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useGiftPacks } from '@/hooks/useGiftPacks';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartSummary() {
  const navigate = useNavigate();
  const { items, calculateTotals } = useCart();
  const { data: giftPacks, isLoading } = useGiftPacks();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Separator />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { subtotal, tax, total } = calculateTotals(giftPacks || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">GST (18%)</span>
          <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-serif text-2xl font-bold text-terracotta">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg" 
          onClick={() => navigate({ to: '/checkout' })}
          disabled={items.length === 0}
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
