import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, DeliveryAddress } from '@/backend';

interface UpdateProfileParams {
  name: string;
  email: string;
  phone: string;
  address: DeliveryAddress;
  pincode: string;
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const query = useQuery<UserProfile | null>({
    queryKey: ['userProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  const updateProfile = useMutation<UserProfile, Error, UpdateProfileParams>({
    mutationFn: async ({ name, email, phone, address, pincode }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createOrUpdateUserProfile(name, email, phone, address, pincode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile,
  };
}
