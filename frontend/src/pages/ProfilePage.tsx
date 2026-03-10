import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useActor } from '@/hooks/useActor';
import { validatePincode, validatePhone } from '@/utils/validation';
import { toast } from 'sonner';
import OrderHistorySection from '@/components/profile/OrderHistorySection';
import type { DeliveryAddress } from '@/backend';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading, updateProfile } = useUserProfile();
  const { actor } = useActor();
  const [pincodeStatus, setPincodeStatus] = useState<{
    isChecking: boolean;
    isServiceable: boolean | null;
    checked: boolean;
  }>({ isChecking: false, isServiceable: null, checked: false });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const selectedState = watch('state');
  const pincode = watch('pincode');

  // Redirect if not authenticated
  useEffect(() => {
    if (!identity) {
      toast.error('Please login to access your profile');
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  // Pre-fill form with existing profile data
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        street: profile.defaultAddress.street,
        city: profile.defaultAddress.city,
        state: profile.defaultAddress.state,
        pincode: profile.defaultAddress.pincode,
      });
    }
  }, [profile, reset]);

  // Check pincode serviceability when valid pincode is entered
  useEffect(() => {
    const checkPincode = async () => {
      if (!pincode || !validatePincode(pincode) || !actor) {
        setPincodeStatus({ isChecking: false, isServiceable: null, checked: false });
        return;
      }

      setPincodeStatus({ isChecking: true, isServiceable: null, checked: false });

      try {
        const isServiceable = await actor.isPincodeServiceable(pincode);
        setPincodeStatus({ isChecking: false, isServiceable, checked: true });
      } catch (error) {
        console.error('Error checking pincode:', error);
        setPincodeStatus({ isChecking: false, isServiceable: false, checked: true });
      }
    };

    const timeoutId = setTimeout(checkPincode, 500);
    return () => clearTimeout(timeoutId);
  }, [pincode, actor]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!pincodeStatus.isServiceable) {
      toast.error('Please enter a serviceable pincode');
      return;
    }

    const address: DeliveryAddress = {
      id: profile?.defaultAddress.id || `addr-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    };

    updateProfile.mutate(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address,
        pincode: data.pincode,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully!');
        },
        onError: (error) => {
          toast.error(`Failed to update profile: ${error.message}`);
        },
      }
    );
  };

  if (!identity) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="mb-6 font-serif text-3xl font-bold text-terracotta">My Profile</h1>

        {/* Profile Form */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      validate: (value) => validatePhone(value) || 'Invalid phone number (10 digits required)',
                    })}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="mb-4 font-serif text-lg font-semibold">Default Delivery Address</h3>

                  {/* Street Address */}
                  <div className="mb-4">
                    <Label htmlFor="street">Street Address *</Label>
                    <Textarea
                      id="street"
                      {...register('street', { required: 'Street address is required' })}
                      placeholder="House/Flat No., Building Name, Street"
                      rows={3}
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-destructive">{errors.street.message}</p>
                    )}
                  </div>

                  {/* City */}
                  <div className="mb-4">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register('city', { required: 'City is required' })}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  {/* State */}
                  <div className="mb-4">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={selectedState}
                      onValueChange={(value) => setValue('state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-destructive">{errors.state.message}</p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div className="mb-4">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      {...register('pincode', {
                        required: 'Pincode is required',
                        validate: (value) => validatePincode(value) || 'Invalid pincode (6 digits required)',
                      })}
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-destructive">{errors.pincode.message}</p>
                    )}

                    {/* Pincode Status Indicator */}
                    {pincode && validatePincode(pincode) && (
                      <div className="mt-2">
                        {pincodeStatus.isChecking ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Checking delivery availability...</span>
                          </div>
                        ) : pincodeStatus.checked && pincodeStatus.isServiceable !== null ? (
                          pincodeStatus.isServiceable ? (
                            <div className="flex items-center gap-2 text-sm text-sage">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Delivery available to this pincode</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                              <XCircle className="h-4 w-4" />
                              <span>Sorry, we don't deliver to this pincode yet</span>
                            </div>
                          )
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={updateProfile.isPending || !pincodeStatus.isServiceable}
                  className="w-full"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>

                {pincodeStatus.checked && !pincodeStatus.isServiceable && (
                  <p className="text-center text-sm text-muted-foreground">
                    Please enter a serviceable pincode to save your profile
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Order History Section */}
        <OrderHistorySection />
      </div>
    </div>
  );
}
