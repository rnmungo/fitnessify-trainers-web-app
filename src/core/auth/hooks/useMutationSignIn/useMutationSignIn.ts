import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';
import type { User } from '@/types/session';

interface SignInParams {
  email: string;
  password: string;
}

const signIn = async ({ email, password }: SignInParams): Promise<User> => {
  const response = await internalClient.post('/auth/sign-in', {
    email,
    password,
  });
  return response.data;
};

const useMutationSignIn = (): UseMutationResult<User, unknown, SignInParams, unknown> => {
  const mutation = useMutation<User, unknown, SignInParams, unknown>({
    mutationFn: signIn,
  });

  return mutation;
};

export default useMutationSignIn;
