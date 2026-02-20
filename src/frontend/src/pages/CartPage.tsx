import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartItemRow from '@/components/cart/CartItemRow';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [, setRefresh] = useState(0);

  // Force refresh when cart is updated
  useEffect(() => {
    const handleCartUpdate = () => {
      setRefresh((prev) => prev + 1);
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-6 font-serif text-2xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Start adding some beautiful gift packs to your cart
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button onClick={() => navigate({ to: '/catalog' })}>Browse Gift Packs</Button>
              <Button variant="outline" onClick={() => navigate({ to: '/custom' })}>
                Create Custom Pack
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">Shopping Cart</h1>
            <p className="mt-2 text-muted-foreground">{items.length} item(s) in your cart</p>
          </div>
          <Button variant="ghost" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemRow key={`${item.packId}-${item.customMessage || ''}`} item={item} />
            ))}
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <CartSummary />
          </aside>
        </div>
      </div>
    </div>
  );
}
