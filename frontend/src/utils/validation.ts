import { useActor } from '@/hooks/useActor';

export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(phone);
}

export async function checkDeliveryAvailability(pincode: string): Promise<boolean> {
  // This function needs to be called from a component with access to the actor
  // For now, return true for valid pincodes
  // The actual check will be done in the component using the actor
  return validatePincode(pincode);
}

// Aliases for backward compatibility
export const isPincodeValid = validatePincode;
export const isPhoneValid = validatePhone;
