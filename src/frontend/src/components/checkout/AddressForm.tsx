import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useActor } from '@/hooks/useActor';
import { validatePincode, validatePhone } from '@/utils/validation';
import type { DeliveryAddress } from '@/backend';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface AddressFormProps {
  onSubmit: (address: DeliveryAddress) => void;
  isSubmitting: boolean;
}

export default function AddressForm({ onSubmit, isSubmitting }: AddressFormProps) {
  const { data: profile } = useUserProfile();
  const { actor } = useActor();
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        street: profile.defaultAddress?.street || '',
        city: profile.defaultAddress?.city || '',
        state: profile.defaultAddress?.state || '',
        pincode: profile.defaultAddress?.pincode || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handlePincodeChange = async (pincode: string) => {
    setFormData({ ...formData, pincode });
    
    if (validatePincode(pincode)) {
      setIsCheckingPincode(true);
      setPincodeStatus('checking');
      
      try {
        if (!actor) {
          setPincodeStatus('invalid');
          return;
        }
        
        const isServiceable = await actor.isPincodeServiceable(pincode);
        setPincodeStatus(isServiceable ? 'valid' : 'invalid');
        
        if (!isServiceable) {
          toast.error('Sorry, we do not deliver to this pincode yet.');
        }
      } catch (error) {
        setPincodeStatus('invalid');
        toast.error('Failed to check pincode serviceability');
      } finally {
        setIsCheckingPincode(false);
      }
    } else {
      setPincodeStatus('idle');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePincode(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (pincodeStatus !== 'valid') {
      toast.error('Please enter a serviceable pincode');
      return;
    }

    const address: DeliveryAddress = {
      id: Date.now().toString(),
      name: formData.name,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      phone: formData.phone,
    };

    onSubmit(address);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Delivery Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <div className="relative">
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  maxLength={6}
                  required
                />
                {isCheckingPincode && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
                {!isCheckingPincode && pincodeStatus === 'valid' && (
                  <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage" />
                )}
                {!isCheckingPincode && pincodeStatus === 'invalid' && (
                  <XCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-terracotta" />
                )}
              </div>
              {pincodeStatus === 'valid' && (
                <p className="mt-1 text-xs text-sage">Delivery available</p>
              )}
              {pincodeStatus === 'invalid' && (
                <p className="mt-1 text-xs text-terracotta">Not serviceable</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                maxLength={10}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || pincodeStatus !== 'valid'}
          >
            {isSubmitting ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
