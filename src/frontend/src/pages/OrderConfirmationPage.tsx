import { useParams, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { CheckCircle2, Package, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const [paymentId, setPaymentId] = useState<string>('N/A');

  useEffect(() => {
    // Retrieve payment ID from sessionStorage
    const storedPaymentId = sessionStorage.getItem('lastPaymentId');
    if (storedPaymentId) {
      setPaymentId(storedPaymentId);
      // Clear it after retrieving
      sessionStorage.removeItem('lastPaymentId');
    }
  }, []);

  // Calculate estimated delivery (5-7 business days)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-terracotta/5 to-sage/5 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sage/20">
              <CheckCircle2 className="h-12 w-12 text-sage" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Thank you for your order. We'll send you a confirmation shortly.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono text-lg font-semibold">{orderId}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="text-lg font-semibold">
                  {estimatedDelivery.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">5-7 business days</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge className="mt-1 bg-green-500/10 text-green-600">Paid</Badge>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <p className="font-mono text-sm font-medium">{paymentId}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button className="flex-1" onClick={() => navigate({ to: '/' })}>
              Continue Shopping
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate({ to: '/catalog' })}>
              Browse More Gifts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
