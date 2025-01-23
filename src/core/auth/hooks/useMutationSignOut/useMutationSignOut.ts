import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';

const logOut = async (): Promise<void> => {
  const response = await internalClient.post('/auth/sign-out');
  return response.data;
};

const useMutationSignOut = (): UseMutationResult<void, unknown, void, unknown> => {
  const mutation = useMutation<void, unknown, void, unknown>({
    mutationFn: logOut,
  });

  return mutation;
};

export default useMutationSignOut;
