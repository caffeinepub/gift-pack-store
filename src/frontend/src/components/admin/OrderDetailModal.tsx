import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, MapPin, CreditCard, MessageSquare, Gift } from 'lucide-react';
import type { Order, OrderStatus } from '@/backend';
import { useUpdateOrderStatus } from '@/hooks/useOrderManagement';
import { useGiftPacks } from '@/hooks/useGiftPacks';

interface OrderDetailModalProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export default function OrderDetailModal({ order, open, onOpenChange }: OrderDetailModalProps) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const { data: giftPacks } = useGiftPacks();

  const orderDate = new Date(Number(order.createdAt) / 1000000);
  const formattedDate = format(orderDate, 'MMM dd, yyyy HH:mm');
  const statusInfo = statusConfig[order.status];
  const paymentStatus = order.paymentId && order.paymentId !== '' ? 'paid' : 'pending';
  const paymentInfo = paymentStatusConfig[paymentStatus];

  const handleStatusChange = (newStatus: string) => {
    updateStatus({
      orderId: order.id,
      status: newStatus as OrderStatus,
    });
  };

  const getGiftPackTitle = (packId: string) => {
    if (packId.startsWith('custom-')) {
      return 'Custom Gift Pack';
    }
    const pack = giftPacks?.find((p) => p.id === packId);
    return pack?.title || `Gift Pack #${packId.slice(0, 8)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Order Details</DialogTitle>
          <DialogDescription>
            Order #{order.id.slice(-8)} • {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Status and Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order Status</span>
                  <Select
                    value={order.status}
                    onValueChange={handleStatusChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Status</span>
                  <Badge className={paymentInfo.className}>{paymentInfo.label}</Badge>
                </div>
                {order.paymentId && order.paymentId !== '' && (
                  <div className="flex items-start gap-2 rounded-md bg-muted p-3">
                    <CreditCard className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Payment ID</p>
                      <p className="font-mono text-sm">{order.paymentId}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{getGiftPackTitle(item.packId)}</p>
                          <p className="text-sm text-muted-foreground">
                            Pack ID: {item.packId.slice(0, 16)}...
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Qty: {Number(item.quantity)}</p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Basket:</span>
                    <Badge variant="outline">{order.basketType}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Size:</span>
                    <Badge variant="outline">{order.size}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Packing:</span>
                    <Badge variant="outline">{order.packingType}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message Card */}
            {order.messageCard && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Message Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="italic text-sm">&quot;{order.messageCard}&quot;</p>
                </CardContent>
              </Card>
            )}

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-semibold">{order.deliveryAddress.name}</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryAddress.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} -{' '}
                    {order.deliveryAddress.pincode}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="text-sm font-medium">{order.deliveryAddress.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Total Amount */}
            <Card className="border-terracotta/20 bg-terracotta/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="font-serif text-2xl font-bold text-terracotta">
                    ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
