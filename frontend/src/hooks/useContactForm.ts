import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function useContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      if (!actor) {
        throw new Error('Backend actor not initialized');
      }

      await actor.submitContactForm(
        data.name,
        data.email,
        data.phone || '',
        data.message
      );
    },
  });
}
