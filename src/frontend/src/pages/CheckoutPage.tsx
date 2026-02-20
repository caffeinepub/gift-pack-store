import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AddressForm from '@/components/checkout/AddressForm';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrder';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGiftPacks } from '@/hooks/useGiftPacks';
import { BasketType, Size, PackType } from '@/backend';
import type { DeliveryAddress } from '@/backend';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, calculateTotals } = useCart();
  const { data: giftPacks, isLoading: isLoadingPacks } = useGiftPacks();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { identity, login, isLoggingIn } = useInternetIdentity();

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

  const handleSubmit = (address: DeliveryAddress) => {
    const { total } = calculateTotals(giftPacks || []);

    createOrder(
      {
        userId: identity.getPrincipal().toString(),
        items,
        deliveryAddress: address,
        totalAmount: BigInt(total),
        basketType: BasketType.wickerBasket,
        size: Size.medium,
        packingType: PackType.wrapStyle1,
        messageCard: null,
      },
      {
        onSuccess: (order) => {
          clearCart();
          navigate({ to: '/order-confirmation/$orderId', params: { orderId: order.id } });
          toast.success('Order placed successfully!');
        },
        onError: (error) => {
          console.error('Order creation failed:', error);
          toast.error('Failed to place order. Please try again.');
        },
      }
    );
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

  const { subtotal, tax, total } = calculateTotals(giftPacks || []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 font-serif text-3xl font-bold tracking-tight md:text-4xl">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <AddressForm onSubmit={handleSubmit} isSubmitting={isPending} />
          </div>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items ({items.length})</span>
                  <span className="font-medium">{items.reduce((sum, item) => sum + Number(item.quantity), 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-serif text-2xl font-bold text-terracotta">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
