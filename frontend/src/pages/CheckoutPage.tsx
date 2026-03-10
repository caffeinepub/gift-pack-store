import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AddressForm from '@/components/checkout/AddressForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrder';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGiftPacks } from '@/hooks/useGiftPacks';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useCouponValidation, calculateCouponDiscount } from '@/hooks/useCoupon';
import { BasketType, Size, PackType } from '@/backend';
import type { DeliveryAddress, Coupon } from '@/backend';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, calculateTotals } = useCart();
  const { data: giftPacks, isLoading: isLoadingPacks } = useGiftPacks();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { initiatePayment, isProcessing: isPaymentProcessing } = useRazorpay();
  const { mutate: validateCoupon, isPending: isValidatingCoupon } = useCouponValidation();
  
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!identity) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md text-center">
            <h2 className="font-serif text-2xl font-bold">Login Required</h2>
            <p className="mt-2 text-muted-foreground">
              Please log in to proceed with checkout
            </p>
            <Button className="mt-8" onClick={login} disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md text-center">
            <h2 className="font-serif text-2xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Add some items to your cart before checking out
            </p>
            <Button className="mt-8" onClick={() => navigate({ to: '/catalog' })}>
              Browse Gift Packs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = (address: DeliveryAddress) => {
    setDeliveryAddress(address);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponError(null);
    validateCoupon(couponCode, {
      onSuccess: (coupon) => {
        if (coupon) {
          setAppliedCoupon(coupon);
          toast.success(`Coupon "${coupon.code}" applied successfully!`);
          setCouponCode('');
        } else {
          setCouponError('Invalid or expired coupon code');
        }
      },
      onError: () => {
        setCouponError('Failed to validate coupon. Please try again.');
      },
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    toast.info('Coupon removed');
  };

  const handlePayment = () => {
    if (!deliveryAddress) {
      toast.error('Please fill in your delivery address');
      return;
    }

    const { total } = calculateTotals(giftPacks || [], appliedCoupon);

    initiatePayment({
      amount: total,
      orderDetails: {
        userId: identity.getPrincipal().toString(),
        items,
        deliveryAddress,
        basketType: BasketType.wickerBasket,
        size: Size.medium,
        packingType: PackType.wrapStyle1,
        messageCard: null,
      },
      onSuccess: (paymentId: string) => {
        createOrder(
          {
            userId: identity.getPrincipal().toString(),
            items,
            deliveryAddress,
            totalAmount: BigInt(total),
            basketType: BasketType.wickerBasket,
            size: Size.medium,
            packingType: PackType.wrapStyle1,
            messageCard: null,
            paymentId,
          },
          {
            onSuccess: (order) => {
              clearCart();
              sessionStorage.setItem('lastPaymentId', paymentId);
              navigate({ 
                to: '/order-confirmation/$orderId', 
                params: { orderId: order.id }
              });
              toast.success('Payment successful! Order placed.');
            },
            onError: (error) => {
              console.error('Order creation failed:', error);
              toast.error('Payment successful but order creation failed. Please contact support.');
            },
          }
        );
      },
      onFailure: (error: any) => {
        console.error('Payment failed:', error);
        toast.error(error.message || 'Payment failed. Please try again.');
      },
    });
  };

  if (isLoadingPacks) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isProcessing = isPaymentProcessing || isCreatingOrder;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 font-serif text-3xl font-bold tracking-tight md:text-4xl">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Address Form and Coupon Section */}
          <div className="lg:col-span-2 space-y-6">
            <AddressForm 
              onSubmit={handleAddressSubmit} 
              isSubmitting={false}
            />

            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Apply Coupon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appliedCoupon ? (
                  <Alert className="bg-sage/10 border-sage">
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{appliedCoupon.code}</span> applied
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({Number(appliedCoupon.discountPercentage)}% off)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-auto p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError(null);
                          }}
                          disabled={isValidatingCoupon}
                        />
                      </div>
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                      >
                        {isValidatingCoupon ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-destructive">{couponError}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {deliveryAddress && (
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${calculateTotals(giftPacks || [], appliedCoupon).total.toLocaleString('en-IN')}`
                )}
              </Button>
            )}
          </div>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <OrderSummary coupon={appliedCoupon} />
          </aside>
        </div>
      </div>
    </div>
  );
}
