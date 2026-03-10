import { useState } from 'react';
import { MapPin, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { validatePincode } from '@/utils/validation';
import { useActor } from '@/hooks/useActor';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ isServiceable: boolean; checked: boolean } | null>(null);
  const { actor } = useActor();

  const handleCheck = async () => {
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
      handleCheck();
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md border-2 border-terracotta/20 bg-white/80 shadow-lg backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-terracotta" />
          <h3 className="font-serif text-lg font-semibold text-foreground">Check Delivery Availability</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Enter your pincode to see if we deliver to your area
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter 6-digit pincode"
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
            onClick={handleCheck}
            disabled={pincode.length !== 6 || isChecking}
            className="bg-terracotta hover:bg-terracotta/90"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking
              </>
            ) : (
              'Check'
            )}
          </Button>
        </div>

        {result?.checked && (
          <div className="mt-4">
            {!validatePincode(pincode) ? (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Invalid Pincode</p>
                  <p className="text-destructive/80">Please enter a valid 6-digit pincode</p>
                </div>
              </div>
            ) : result.isServiceable ? (
              <div className="flex items-start gap-2 rounded-lg bg-sage/10 p-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-sage" />
                <div>
                  <p className="font-medium text-sage">Great! We deliver to your area</p>
                  <p className="text-sage/80">Start browsing our gift collections now</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Sorry, we don't deliver to this pincode yet</p>
                  <p className="text-destructive/80">We're expanding our delivery network. Check back soon!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
