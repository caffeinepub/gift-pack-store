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

  const handleIncrement = async () => {
    const newQuantity = Number(item.quantity) + 1;
    await updateQuantity(item.packId, BigInt(newQuantity));
  };

  const handleDecrement = async () => {
    const currentQuantity = Number(item.quantity);
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      await updateQuantity(item.packId, BigInt(newQuantity));
    }
  };

  const handleRemove = () => {
    removeItem(item.packId);
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

  // For custom packs or when pack data is not available, show a fallback
  const isCustomPack = item.packId.startsWith('custom-');
  const displayTitle = pack?.title || (isCustomPack ? 'Custom Gift Pack' : 'Gift Pack');
  const displayCategory = pack?.category || 'custom';
  
  // Calculate price with discount if applicable
  let displayPrice = 1999;
  if (pack) {
    const discount = Number(pack.discount);
    const originalPrice = Number(pack.price);
    displayPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
  }
  
  const imageUrl = pack?.images[0]?.getDirectURL() || '/assets/generated/gift-icon.dim_128x128.png';
  
  const itemTotal = displayPrice * Number(item.quantity);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img src={imageUrl} alt={displayTitle} className="h-full w-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{displayTitle}</h3>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {displayCategory}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={handleRemove}
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
                  onClick={handleDecrement}
                  disabled={Number(item.quantity) <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{Number(item.quantity)}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleIncrement}
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
