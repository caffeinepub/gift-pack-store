import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DeliveryAddress } from '@/backend';
import { validatePincode, validatePhone } from '@/utils/validation';

interface AddressFormProps {
  onSubmit: (address: DeliveryAddress) => void;
  isSubmitting: boolean;
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

export default function AddressForm({ onSubmit, isSubmitting }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DeliveryAddress>();

  const selectedState = watch('state');

  const handleFormSubmit = (data: DeliveryAddress) => {
    onSubmit({
      ...data,
      id: `addr-${Date.now()}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Delivery Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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

          {/* Street Address */}
          <div>
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
          <div>
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
          <div>
            <Label htmlFor="state">State *</Label>
            <Select
              value={selectedState}
              onValueChange={(value) => setValue('state', value, { shouldValidate: true })}
            >
              <SelectTrigger id="state">
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
            <input type="hidden" {...register('state', { required: 'State is required' })} />
            {errors.state && (
              <p className="mt-1 text-sm text-destructive">{errors.state.message}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
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

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
