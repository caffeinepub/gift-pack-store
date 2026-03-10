import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { GiftItem, BasketType, Size, PackType } from '@/backend';

interface PackPreviewProps {
  basketType: BasketType | null;
  size: Size | null;
  selectedItems: GiftItem[];
  packingType: PackType | null;
  messageCard: string;
  onRemoveItem: (itemId: string) => void;
}

const basketTypeLabels: Record<string, string> = {
  wickerBasket: 'Wicker Basket',
  woodenCrate: 'Wooden Crate',
  giftBox: 'Gift Box',
};

const sizeLabels: Record<string, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

const packingTypeLabels: Record<string, string> = {
  wrapStyle1: 'Classic Wrap',
  wrapStyle2: 'Premium Wrap',
  ribbonColor1: 'Gold Ribbon',
  ribbonColor2: 'Silver Ribbon',
};

const sizePrices: Record<string, number> = {
  small: 0,
  medium: 200,
  large: 400,
};

export default function PackPreview({
  basketType,
  size,
  selectedItems,
  packingType,
  messageCard,
  onRemoveItem,
}: PackPreviewProps) {
  const itemsTotal = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);
  const sizePrice = size ? sizePrices[size] : 0;
  const totalPrice = itemsTotal + sizePrice;

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="font-serif">Your Custom Pack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basket Type */}
        {basketType && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Basket Type</h4>
            <Badge variant="secondary">{basketTypeLabels[basketType]}</Badge>
          </div>
        )}

        {/* Size */}
        {size && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Size</h4>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{sizeLabels[size]}</Badge>
              {sizePrice > 0 && (
                <span className="text-sm text-muted-foreground">
                  +₹{sizePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        )}

        {selectedItems.length > 0 && <Separator />}

        {/* Selected Items */}
        <div>
          <h4 className="mb-2 text-sm font-semibold">
            Selected Items ({selectedItems.length})
          </h4>
          {selectedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items selected yet</p>
          ) : (
            <div className="space-y-2">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-2 rounded-lg border p-2"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Packing Type */}
        {packingType && (
          <>
            <Separator />
            <div>
              <h4 className="mb-2 text-sm font-semibold">Packing Style</h4>
              <Badge variant="secondary">{packingTypeLabels[packingType]}</Badge>
            </div>
          </>
        )}

        {/* Message Card Preview */}
        {messageCard && (
          <>
            <Separator />
            <div>
              <h4 className="mb-2 text-sm font-semibold">Message Card</h4>
              <p className="rounded-lg border bg-muted/50 p-3 text-sm italic">
                "{messageCard}"
              </p>
            </div>
          </>
        )}

        <Separator />

        {/* Total Price */}
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total Price</span>
          <span className="font-serif text-2xl font-bold text-terracotta">
            ₹{totalPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
