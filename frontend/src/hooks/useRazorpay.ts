import { useState } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import type { RazorpayOptions, RazorpayResponse } from '@/types/razorpay';
import type { DeliveryAddress, CartItem, BasketType, Size, PackType } from '@/backend';

interface UseRazorpayPaymentParams {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: any) => void;
  orderDetails: {
    userId: string;
    items: CartItem[];
    deliveryAddress: DeliveryAddress;
    basketType: BasketType;
    size: Size;
    packingType: PackType;
    messageCard: string | null;
  };
}

export function useRazorpay() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { identity } = useInternetIdentity();

  const initiatePayment = ({
    amount,
    onSuccess,
    onFailure,
    orderDetails,
  }: UseRazorpayPaymentParams) => {
    if (!window.Razorpay) {
      onFailure(new Error('Razorpay SDK not loaded'));
      return;
    }

    setIsProcessing(true);

    const options: RazorpayOptions = {
      key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay key
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      name: 'Gift Pack Store',
      description: 'Gift Pack Order Payment',
      handler: function (response: RazorpayResponse) {
        setIsProcessing(false);
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        name: orderDetails.deliveryAddress.name,
        contact: orderDetails.deliveryAddress.phone,
      },
      notes: {
        userId: orderDetails.userId,
        address: `${orderDetails.deliveryAddress.street}, ${orderDetails.deliveryAddress.city}`,
      },
      theme: {
        color: '#C17A5F', // Terracotta color
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          onFailure(new Error('Payment cancelled by user'));
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response: any) {
      setIsProcessing(false);
      onFailure(response.error);
    });

    rzp.open();
  };

  return {
    initiatePayment,
    isProcessing,
  };
}
