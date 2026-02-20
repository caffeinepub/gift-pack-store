import { format } from 'date-fns';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Order, OrderStatus } from '@/backend';

interface OrderHistoryCardProps {
  order: Order;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-500/10 text-blue-600' },
  shipped: { label: 'Shipped', className: 'bg-purple-500/10 text-purple-600' },
  delivered: { label: 'Delivered', className: 'bg-green-500/10 text-green-600' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/10 text-red-600' },
};

export default function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const orderDate = new Date(Number(order.createdAt) / 1000000); // Convert nanoseconds to milliseconds
  const formattedDate = format(orderDate, 'MMM dd, yyyy');
  const statusInfo = statusConfig[order.status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-terracotta" />
            <div>
              <CardTitle className="text-base font-semibold">Order #{order.id.slice(-8)}</CardTitle>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="font-serif text-lg font-bold text-terracotta">
              ₹{Number(order.totalAmount).toLocaleString('en-IN')}
            </span>
          </div>

          <Separator />

          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between"
            >
              <span className="text-sm font-medium">
                {order.items.length} item{order.items.length > 1 ? 's' : ''}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {isExpanded && (
              <div className="mt-3 space-y-2 rounded-md bg-muted/50 p-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Pack ID: {item.packId.slice(0, 12)}...
                    </span>
                    <span className="font-medium">Qty: {Number(item.quantity)}</span>
                  </div>
                ))}
                {order.messageCard && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">Message Card:</p>
                    <p className="text-sm italic">&quot;{order.messageCard}&quot;</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Delivery to: {order.deliveryAddress.name}</p>
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
