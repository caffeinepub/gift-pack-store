import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGiftPackById } from '@/hooks/useGiftPacks';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Loader2, ChevronLeft, ChevronRight, Gift, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function GiftPackDetailPage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: pack, isLoading, isError } = useGiftPackById(id as string);
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = async () => {
    if (!pack) return;
    
    setIsAddingToCart(true);
    try {
      addItem({
        packId: pack.id,
        quantity: 1n,
        customMessage: undefined,
        wrappingOption: undefined,
      });
      toast.success('Added to cart!', {
        description: `${pack.title} has been added to your cart.`,
      });
    } catch (error) {
      toast.error('Failed to add to cart', {
        description: 'Please try again.',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePrevImage = () => {
    if (!pack?.images) return;
    setCurrentImageIndex((prev) => (prev === 0 ? pack.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!pack?.images) return;
    setCurrentImageIndex((prev) => (prev === pack.images.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !pack) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <Gift className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="font-serif text-2xl font-bold">Gift Pack Not Found</h2>
          <p className="text-muted-foreground">
            The gift pack you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate({ to: '/catalog' })} className="bg-terracotta hover:bg-terracotta/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  const hasMultipleImages = pack.images && pack.images.length > 1;
  const discountedPrice =
    Number(pack.discount) > 0
      ? Number(pack.price) * (1 - Number(pack.discount) / 100)
      : Number(pack.price);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/catalog' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Catalog
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative aspect-square w-full bg-muted">
              {pack.images && pack.images.length > 0 && pack.images[currentImageIndex] ? (
                <>
                  <img
                    src={pack.images[currentImageIndex].getDirectURL()}
                    alt={pack.title}
                    className="h-full w-full object-cover"
                  />
                  {hasMultipleImages && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Gift className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
              {Number(pack.discount) > 0 && (
                <Badge className="absolute right-4 top-4 bg-sage text-sage-foreground">
                  {Number(pack.discount)}% OFF
                </Badge>
              )}
            </div>
          </Card>

          {/* Thumbnail Gallery */}
          {hasMultipleImages && (
            <div className="flex gap-2 overflow-x-auto">
              {pack.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-terracotta'
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <img
                    src={image.getDirectURL()}
                    alt={`${pack.title} - ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{pack.category}</Badge>
              <Badge variant="outline">{pack.size}</Badge>
              <Badge variant="outline">{pack.basketType}</Badge>
            </div>
            <h1 className="font-serif text-4xl font-bold">{pack.title}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-terracotta">
              ₹{discountedPrice.toLocaleString('en-IN')}
            </p>
            {Number(pack.discount) > 0 && (
              <p className="text-xl text-muted-foreground line-through">
                ₹{Number(pack.price).toLocaleString('en-IN')}
              </p>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">{pack.description}</p>
          </div>

          {pack.items && pack.items.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 font-semibold">What's Included:</h3>
                <ul className="space-y-2">
                  {pack.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            size="lg"
            className="w-full bg-terracotta text-lg hover:bg-terracotta/90"
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Adding to Cart...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </>
            )}
          </Button>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 font-semibold">Delivery Information</h4>
            <p className="text-sm text-muted-foreground">
              Free delivery on orders above ₹999. Standard delivery takes 3-5 business days.
              Check pincode serviceability at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
