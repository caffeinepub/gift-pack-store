import { Minus, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useGiftPackById } from '@/hooks/useGiftPacks';
import type { CartItem } from '@/backend';
import { Skeleton } from '@/components/ui/skeleton';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const { data: pack, isLoading } = useGiftPackById(item.packId);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(item.packId, BigInt(newQuantity));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pack) {
    return null;
  }

  const imageUrl = pack.images[0]?.getDirectURL() || '/assets/generated/gift-icon.dim_128x128.png';
  const itemTotal = Number(pack.price) * Number(item.quantity);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img src={imageUrl} alt={pack.title} className="h-full w-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{pack.title}</h3>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {pack.category}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeItem(item.packId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Custom Message */}
              {item.customMessage && (
                <p className="mt-2 text-sm italic text-muted-foreground">
                  Message: "{item.customMessage}"
                </p>
              )}

              {/* Wrapping Option */}
              {item.wrappingOption && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Wrapping: {item.wrappingOption.split('-').join(' ')}
                </p>
              )}
            </div>

            {/* Quantity and Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(Number(item.quantity) - 1)}
                  disabled={Number(item.quantity) <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{Number(item.quantity)}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(Number(item.quantity) + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <p className="font-serif text-lg font-bold text-terracotta">
                ₹{itemTotal.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
