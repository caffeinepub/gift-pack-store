import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Gift, Menu, ShoppingCart, User, MapPin, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { validatePincode } from '@/utils/validation';
import { useActor } from '@/hooks/useActor';

export default function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ isServiceable: boolean; checked: boolean } | null>(null);
  const { actor } = useActor();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const baseNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/catalog' },
    { label: 'Custom Pack', path: '/custom' },
  ];

  // Add Admin link only for authenticated admin users
  const navItems = isAdminAuthenticated
    ? [...baseNavItems, { label: 'Admin', path: '/admin' }]
    : baseNavItems;

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  const handleCheckPincode = async () => {
    if (!validatePincode(pincode)) {
      setResult({ isServiceable: false, checked: true });
      return;
    }

    if (!actor) return;

    setIsChecking(true);
    setResult(null);

    try {
      const isServiceable = await actor.isPincodeServiceable(pincode);
      setResult({ isServiceable, checked: true });
    } catch (error) {
      console.error('Error checking pincode:', error);
      setResult({ isServiceable: false, checked: true });
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheckPincode();
    }
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
          {/* Pincode Checker - Desktop */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                title="Check Delivery"
              >
                <MapPin className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-terracotta" />
                  <h3 className="font-serif text-base font-semibold">Check Delivery</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter your pincode to see if we deliver to your area
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="6-digit pincode"
                    value={pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 6) {
                        setPincode(value);
                        setResult(null);
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    maxLength={6}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCheckPincode}
                    disabled={isChecking || pincode.length !== 6}
                    size="sm"
                  >
                    {isChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Check'
                    )}
                  </Button>
                </div>
                {result?.checked && (
                  <div
                    className={`flex items-center gap-2 rounded-md p-3 ${
                      result.isServiceable
                        ? 'bg-sage/10 text-sage'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {result.isServiceable ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          Great! We deliver to this area
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          Sorry, we don't deliver here yet
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Cart */}
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
                className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </Button>

          {/* Profile / Login */}
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation('/profile')}
              title="Profile"
            >
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Login'
              )}
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 py-4">
                <div className="font-serif text-lg font-bold text-terracotta">Menu</div>
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="text-left text-sm font-medium transition-colors hover:text-terracotta"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="my-2 border-t" />
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="text-left text-sm font-medium transition-colors hover:text-terracotta"
                >
                  Contact Us
                </button>
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clear();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-2"
                  >
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
