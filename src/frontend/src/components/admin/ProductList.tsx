import { useCustomProducts } from '@/hooks/useCustomProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Package } from 'lucide-react';
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
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Failed to load products. Please try again.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-semibold">All Products</h3>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No products yet. Create your first product above.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-semibold">All Products ({products.length})</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              {product.images && product.images.length > 0 && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
                <Badge variant="secondary" className="shrink-0">
                  {product.category}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-terracotta">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(product)}
                    disabled={isDeleting}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
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
