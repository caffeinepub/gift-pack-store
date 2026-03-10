import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Loader2, ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import type { GiftPack } from '@/backend';

interface GiftPackCardProps {
  pack: GiftPack;
  onAddToCart: (packId: string) => void;
  isAddingToCart?: boolean;
}

export default function GiftPackCard({ pack, onAddToCart, isAddingToCart }: GiftPackCardProps) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = pack.images && pack.images.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? pack.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === pack.images.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = () => {
    navigate({ to: `/gift-pack/${pack.id}` });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(pack.id);
  };

  const discountedPrice =
    Number(pack.discount) > 0
      ? Number(pack.price) * (1 - Number(pack.discount) / 100)
      : Number(pack.price);

  return (
    <Card 
      className="group overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {pack.images && pack.images.length > 0 && pack.images[currentImageIndex] ? (
          <>
            <img
              src={pack.images[currentImageIndex].getDirectURL()}
              alt={pack.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {hasMultipleImages && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {pack.images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'w-4 bg-white'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Gift className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {Number(pack.discount) > 0 && (
          <Badge className="absolute right-2 top-2 bg-sage text-sage-foreground">
            {Number(pack.discount)}% OFF
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 font-serif text-xl">{pack.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {pack.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{pack.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-terracotta">
              ₹{discountedPrice.toLocaleString('en-IN')}
            </p>
            {Number(pack.discount) > 0 && (
              <p className="text-sm text-muted-foreground line-through">
                ₹{Number(pack.price).toLocaleString('en-IN')}
              </p>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-terracotta hover:bg-terracotta/90"
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
