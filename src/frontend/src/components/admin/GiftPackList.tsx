import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import type { GiftPack } from '@/backend';

interface GiftPackListProps {
  giftPacks: GiftPack[];
  isLoading: boolean;
  onEdit?: (giftPack: GiftPack) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const formatBasketType = (type: string) => {
  const map: Record<string, string> = {
    wickerBasket: 'Wicker Basket',
    woodenCrate: 'Wooden Crate',
    giftBox: 'Gift Box',
  };
  return map[type] || type;
};

const formatSize = (size: string) => {
  return size.charAt(0).toUpperCase() + size.slice(1);
};

const formatCategory = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default function GiftPackList({ giftPacks, isLoading, onEdit, onDelete, isDeleting }: GiftPackListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packToDelete, setPackToDelete] = useState<GiftPack | null>(null);

  const handleDeleteClick = (pack: GiftPack) => {
    setPackToDelete(pack);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (packToDelete && onDelete) {
      onDelete(packToDelete.id);
      setDeleteDialogOpen(false);
      setPackToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPackToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!giftPacks || giftPacks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No gift packs created yet. Create your first gift pack above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {giftPacks.map((pack) => {
          const imageUrl = pack.images[0]?.getDirectURL();
          const price = Number(pack.price);
          const discount = Number(pack.discount);
          const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

          return (
            <Card key={pack.id} className="overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={pack.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-muted">
                  <p className="text-sm text-muted-foreground">No image</p>
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{pack.title}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {formatCategory(pack.category)}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {pack.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-xl font-bold text-terracotta">
                    ₹{discountedPrice.toLocaleString('en-IN')}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        {discount}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{formatBasketType(pack.basketType)}</span>
                  <span>•</span>
                  <span>{formatSize(pack.size)}</span>
                </div>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(pack)}
                      className="flex-1"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(pack)}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{packToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
