import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Gift, Menu, Search, ShoppingCart, User, MapPin, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { validatePincode } from '@/utils/validation';
import { useActor } from '@/hooks/useActor';

export default function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ isServiceable: boolean; checked: boolean } | null>(null);
  const { actor } = useActor();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/catalog' },
    { label: 'Custom Pack', path: '/custom' },
    { label: 'Admin', path: '/admin' },
  ];

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
                    disabled={pincode.length !== 6 || isChecking}
                    size="sm"
                    className="bg-terracotta hover:bg-terracotta/90"
                  >
                    {isChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Check'
                    )}
                  </Button>
                </div>

                {result?.checked && (
                  <div>
                    {!validatePincode(pincode) ? (
                      <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                        <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                        <div>
                          <p className="font-medium text-destructive">Invalid Pincode</p>
                          <p className="text-xs text-destructive/80">Enter a valid 6-digit pincode</p>
                        </div>
                      </div>
                    ) : result.isServiceable ? (
                      <div className="flex items-start gap-2 rounded-lg bg-sage/10 p-3 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage" />
                        <div>
                          <p className="font-medium text-sage">We deliver to your area!</p>
                          <p className="text-xs text-sage/80">Start browsing our collections</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                        <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                        <div>
                          <p className="font-medium text-destructive">Not available yet</p>
                          <p className="text-xs text-destructive/80">We're expanding soon!</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation('/catalog')}
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Profile Button (only when authenticated) */}
          {identity && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation('/profile')}
              title="My Profile"
            >
              <User className="h-5 w-5" />
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

          {/* Auth Button */}
          {identity ? (
            <Button variant="ghost" size="sm" onClick={clear} className="hidden sm:flex">
              Logout
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={login} disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          )}

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
                <button
                  onClick={() => handleNavigation('/catalog')}
                  className="text-left text-lg font-medium transition-colors hover:text-terracotta"
                >
                  Search
                </button>
                {identity && (
                  <>
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="text-left text-lg font-medium transition-colors hover:text-terracotta"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        clear();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-lg font-medium transition-colors hover:text-terracotta"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
