import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';
import { format } from 'date-fns';
import type { Order, OrderStatus } from '@/backend';
import OrderDetailModal from './OrderDetailModal';

interface OrderListProps {
  orders: Order[];
  isLoading?: boolean;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-500/10 text-blue-600' },
  shipped: { label: 'Shipped', className: 'bg-purple-500/10 text-purple-600' },
  delivered: { label: 'Delivered', className: 'bg-green-500/10 text-green-600' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/10 text-red-600' },
};

const paymentStatusConfig = {
  paid: { label: 'Paid', className: 'bg-green-500/10 text-green-600' },
  pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600' },
};

export default function OrderList({ orders, isLoading }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No orders found. Orders will appear here once customers place them.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => {
          const orderDate = new Date(Number(order.createdAt) / 1000000);
          const formattedDate = format(orderDate, 'MMM dd, yyyy HH:mm');
          const statusInfo = statusConfig[order.status];
          const paymentStatus = order.paymentId && order.paymentId !== '' ? 'paid' : 'pending';
          const paymentInfo = paymentStatusConfig[paymentStatus];

          return (
            <Card
              key={order.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => setSelectedOrder(order)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-terracotta" />
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Order #{order.id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                    <Badge className={paymentInfo.className}>{paymentInfo.label}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium">{order.deliveryAddress.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="font-medium">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="font-serif text-lg font-bold text-terracotta">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      )}
    </>
  );
}
