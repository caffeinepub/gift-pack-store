import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, Gift } from 'lucide-react';
import type { GiftPack } from '@/backend';

interface CartItemRowProps {
  pack: GiftPack;
  quantity: number;
  customMessage?: string;
  wrappingOption?: string;
  onIncrement: () => Promise<void>;
  onDecrement: () => Promise<void>;
  onRemove: () => void;
}

export default function CartItemRow({
  pack,
  quantity,
  customMessage,
  wrappingOption,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) {
  const discountedPrice =
    Number(pack.discount) > 0
      ? Number(pack.price) * (1 - Number(pack.discount) / 100)
      : Number(pack.price);

  const itemTotal = discountedPrice * quantity;

  return (
    <div className="flex gap-4 border-b pb-4 last:border-0">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        {pack.images && pack.images.length > 0 && pack.images[0] ? (
          <img
            src={pack.images[0].getDirectURL()}
            alt={pack.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Gift className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold">{pack.title}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-sm font-medium text-terracotta">
              ₹{discountedPrice.toLocaleString('en-IN')}
            </p>
            {Number(pack.discount) > 0 && (
              <p className="text-xs text-muted-foreground line-through">
                ₹{Number(pack.price).toLocaleString('en-IN')}
              </p>
            )}
          </div>
          {customMessage && (
            <p className="mt-1 text-sm text-muted-foreground">Message: {customMessage}</p>
          )}
          {wrappingOption && (
            <p className="text-sm text-muted-foreground">Wrapping: {wrappingOption}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={onDecrement}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={onIncrement}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-semibold">₹{itemTotal.toLocaleString('en-IN')}</p>
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
