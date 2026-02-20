import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import AddressForm from '@/components/checkout/AddressForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrder';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { BasketType, Size, PackType } from '@/backend';
import type { DeliveryAddress } from '@/backend';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { identity } = useInternetIdentity();
  const createOrderMutation = useCreateOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    navigate({ to: '/cart' });
    return null;
  }

  const handleSubmit = async (address: DeliveryAddress) => {
    if (!identity) {
      toast.error('Please log in to place an order');
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = identity.getPrincipal().toString();
      const order = await createOrderMutation.mutateAsync({
        userId,
        items,
        deliveryAddress: address,
        totalAmount: BigInt(total),
        // Default values for custom pack fields (used for predefined packs)
        basketType: BasketType.wickerBasket,
        size: Size.medium,
        packingType: PackType.wrapStyle1,
        messageCard: null,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate({ to: '/order-confirmation/$orderId', params: { orderId: order.id } });
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AddressForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <OrderSummary />
          </aside>
        </div>
      </div>
    </div>
  );
}
