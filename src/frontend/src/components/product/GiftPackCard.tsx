import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GiftPack } from '@/backend';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface GiftPackCardProps {
  pack: GiftPack;
}

export default function GiftPackCard({ pack }: GiftPackCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      packId: pack.id,
      quantity: BigInt(1),
    });
    toast.success(`${pack.title} added to cart!`);
  };

  const categoryColors: Record<string, string> = {
    birthday: 'bg-terracotta/10 text-terracotta',
    anniversary: 'bg-sage/10 text-sage',
    corporate: 'bg-blue-500/10 text-blue-600',
    festive: 'bg-purple-500/10 text-purple-600',
    custom: 'bg-amber-500/10 text-amber-600',
  };

  const imageUrl = pack.images[0]?.getDirectURL() || '/assets/generated/gift-icon.dim_128x128.png';

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={pack.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold leading-tight">{pack.title}</h3>
          <Badge className={categoryColors[pack.category] || 'bg-muted'}>
            {pack.category}
          </Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{pack.description}</p>
        <p className="mt-3 font-serif text-xl font-bold text-terracotta">
          ₹{Number(pack.price).toLocaleString('en-IN')}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
