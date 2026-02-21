import { Package } from 'lucide-react';
import GiftPackCard from './GiftPackCard';
import { useCart } from '@/hooks/useCart';
import type { GiftPack } from '@/backend';
import { useState } from 'react';

interface ProductGridProps {
  giftPacks: GiftPack[];
}

export default function ProductGrid({ giftPacks }: ProductGridProps) {
  const { addItem } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (packId: string) => {
    setAddingToCart(packId);
    try {
      addItem({
        packId,
        quantity: 1n,
        customMessage: undefined,
        wrappingOption: undefined,
      });
    } finally {
      setAddingToCart(null);
    }
  };

  if (giftPacks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 font-serif text-lg font-semibold">No gift packs found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {giftPacks.map((pack) => (
        <GiftPackCard
          key={pack.id}
          pack={pack}
          onAddToCart={handleAddToCart}
          isAddingToCart={addingToCart === pack.id}
        />
      ))}
    </div>
  );
}
