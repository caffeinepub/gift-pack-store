import { useEffect } from 'react';
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
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useUserProfile } from '@/hooks/useUserProfile';
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const selectedState = watch('state');

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

  const onSubmit = async (data: ProfileFormData) => {
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
                  </div>
                </div>

                <Button type="submit" disabled={updateProfile.isPending} className="w-full">
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
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
