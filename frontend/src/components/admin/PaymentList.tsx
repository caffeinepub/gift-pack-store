import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard } from 'lucide-react';
import type { RazorpayPayment } from '@/backend';
import PaymentDetailModal from './PaymentDetailModal';

interface PaymentListProps {
  payments: RazorpayPayment[];
  isLoading?: boolean;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  success: { label: 'Success', className: 'bg-green-500/10 text-green-600' },
  pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600' },
  failed: { label: 'Failed', className: 'bg-red-500/10 text-red-600' },
};

export default function PaymentList({ payments, isLoading }: PaymentListProps) {
  const [selectedPayment, setSelectedPayment] = useState<RazorpayPayment | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No payments found. Payments will appear here once customers complete transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {payments.map((payment) => {
          const statusInfo = statusConfig[payment.status.toLowerCase()] || statusConfig.pending;

          return (
            <Card
              key={payment.paymentId}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => setSelectedPayment(payment)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-terracotta" />
                    <CardTitle className="text-base font-semibold">Payment</CardTitle>
                  </div>
                  <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-sm truncate">{payment.paymentId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-serif text-xl font-bold text-terracotta">
                    ₹{Number(payment.amount).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Method</p>
                  <p className="text-sm font-medium">Razorpay</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payer</p>
                  <p className="font-mono text-xs truncate">{payment.payer.toString()}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          open={!!selectedPayment}
          onOpenChange={(open) => !open && setSelectedPayment(null)}
        />
      )}
    </>
  );
}
