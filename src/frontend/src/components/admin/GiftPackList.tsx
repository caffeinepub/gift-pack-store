import { useGiftPacks } from '@/hooks/useGiftPacks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Gift } from 'lucide-react';
import type { GiftPack } from '@/backend';

interface GiftPackListProps {
  onEdit: (giftPack: GiftPack) => void;
  onDelete: (giftPackId: string) => void;
  isDeleting?: boolean;
}

export default function GiftPackList({ onEdit, onDelete, isDeleting }: GiftPackListProps) {
  const { data: giftPacks, isLoading, error } = useGiftPacks();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-semibold">All Gift Packs</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Failed to load gift packs. Please try again.</p>
      </div>
    );
  }

  if (!giftPacks || giftPacks.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-semibold">All Gift Packs</h3>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gift className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No gift packs yet. Create your first gift pack above.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-semibold">All Gift Packs ({giftPacks.length})</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {giftPacks.map((pack) => (
          <Card key={pack.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              {pack.images && pack.images.length > 0 && pack.images[0] ? (
                <img
                  src={pack.images[0].getDirectURL()}
                  alt={pack.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Gift className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-1 text-lg">{pack.title}</CardTitle>
                {Number(pack.discount) > 0 && (
                  <Badge className="shrink-0 bg-sage text-sage-foreground">
                    {Number(pack.discount)}% OFF
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2">{pack.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{pack.category}</Badge>
                <Badge variant="outline">{pack.basketType}</Badge>
                <Badge variant="outline">{pack.size}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-terracotta">
                  ₹{Number(pack.price).toLocaleString('en-IN')}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(pack)}
                    disabled={isDeleting}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" disabled={isDeleting}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Gift Pack</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{pack.title}"? This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(pack.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
