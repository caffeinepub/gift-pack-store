import { useCustomProducts } from '@/hooks/useCustomProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2 } from 'lucide-react';
import type { Product } from '@/backend';

interface ProductListProps {
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  isDeleting?: boolean;
}

export default function ProductList({ onEdit, onDelete, isDeleting }: ProductListProps) {
  const { data: products, isLoading, error } = useCustomProducts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-semibold">All Products</h3>
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
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
        <p className="text-sm text-destructive">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No products yet. Add your first product to get started.
        </p>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      corporate: 'Corporate',
      festive: 'Festive',
      sympathy: 'Sympathy',
      wellness: 'Wellness',
      custom: 'Custom',
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-semibold">All Products ({products.length})</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="font-serif text-lg">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryLabel(product.category)}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.imageUrl && (
                <div className="aspect-video overflow-hidden rounded-md bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {product.description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <p className="font-semibold text-terracotta">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                    disabled={isDeleting}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
