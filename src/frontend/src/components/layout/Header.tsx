import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Gift, Menu, ShoppingCart, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/catalog' },
    { label: 'Custom Pack', path: '/custom' },
  ];

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 font-serif text-xl font-bold text-terracotta transition-colors hover:text-terracotta/80"
        >
          <Gift className="h-6 w-6" />
          <span className="hidden sm:inline">GiftPack Store</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="text-sm font-medium transition-colors hover:text-terracotta"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Auth Button */}
          {identity ? (
            <Button variant="ghost" size="sm" onClick={clear}>
              <User className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={login} disabled={isLoggingIn}>
              <User className="mr-2 h-4 w-4" />
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          )}

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => handleNavigation('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 pt-8">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="text-left text-lg font-medium transition-colors hover:text-terracotta"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
