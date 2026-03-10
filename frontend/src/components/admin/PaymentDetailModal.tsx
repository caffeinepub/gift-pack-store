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
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreditCard, User, Package, MapPin } from 'lucide-react';
import type { RazorpayPayment } from '@/backend';
import { useAllOrders } from '@/hooks/useOrderManagement';

interface PaymentDetailModalProps {
  payment: RazorpayPayment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  success: { label: 'Success', className: 'bg-green-500/10 text-green-600' },
  pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600' },
  failed: { label: 'Failed', className: 'bg-red-500/10 text-red-600' },
};

export default function PaymentDetailModal({
  payment,
  open,
  onOpenChange,
}: PaymentDetailModalProps) {
  const { data: orders } = useAllOrders();
  const statusInfo = statusConfig[payment.status.toLowerCase()] || statusConfig.pending;

  // Find the order associated with this payment
  const associatedOrder = orders?.find((order) => order.paymentId === payment.paymentId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Payment Details</DialogTitle>
          <DialogDescription>Transaction ID: {payment.paymentId}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Amount</span>
                  <span className="font-serif text-2xl font-bold text-terracotta">
                    ₹{Number(payment.amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Method</span>
                  <span className="text-sm">Razorpay</span>
                </div>
                <Separator />
                <div className="space-y-1">
                  <span className="text-sm font-medium">Transaction ID</span>
                  <p className="font-mono text-sm break-all rounded-md bg-muted p-2">
                    {payment.paymentId}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Payer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <span className="text-sm font-medium">Principal ID</span>
                  <p className="font-mono text-sm break-all rounded-md bg-muted p-2">
                    {payment.payer.toString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Associated Order */}
            {associatedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Associated Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order ID</span>
                    <span className="font-mono text-sm">#{associatedOrder.id.slice(-8)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order Status</span>
                    <Badge variant="outline">{associatedOrder.status}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Items</span>
                    <span className="text-sm">
                      {associatedOrder.items.length} item
                      {associatedOrder.items.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Delivery Address</p>
                        <p className="text-sm text-muted-foreground">
                          {associatedOrder.deliveryAddress.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {associatedOrder.deliveryAddress.street}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {associatedOrder.deliveryAddress.city},{' '}
                          {associatedOrder.deliveryAddress.state} -{' '}
                          {associatedOrder.deliveryAddress.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Phone: {associatedOrder.deliveryAddress.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!associatedOrder && (
              <Card>
                <CardContent className="py-6 text-center text-sm text-muted-foreground">
                  No associated order found for this payment.
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
