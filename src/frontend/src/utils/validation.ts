export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(phone);
}

export function checkDeliveryAvailability(pincode: string): boolean {
  // For now, all valid pincodes are deliverable
  return validatePincode(pincode);
}
