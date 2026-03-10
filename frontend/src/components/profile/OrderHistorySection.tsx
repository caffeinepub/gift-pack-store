import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import OrderHistoryCard from './OrderHistoryCard';
import { useOrderHistory } from '@/hooks/useOrderHistory';

export default function OrderHistorySection() {
  const { data: orders, isLoading, error } = useOrderHistory();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-terracotta">Order History</h2>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-terracotta">Order History</h2>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Failed to load order history</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort orders by date (most recent first)
  const sortedOrders = [...(orders || [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt)
  );

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl font-bold text-terracotta">Order History</h2>
      
      {sortedOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-serif text-lg font-semibold">No orders yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your order history will appear here once you make your first purchase
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
