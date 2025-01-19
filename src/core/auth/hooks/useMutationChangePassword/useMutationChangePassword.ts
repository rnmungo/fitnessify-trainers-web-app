import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';
import type { User } from '@/types/session';

interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const changePassword = async ({ currentPassword, newPassword, confirmPassword }: ChangePasswordParams): Promise<User> => {
  const response = await internalClient.post('/account/change-password', {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

const useMutationChangePassword = (): UseMutationResult<User, unknown, ChangePasswordParams, unknown> => {
  const mutation = useMutation<User, unknown, ChangePasswordParams, unknown>({
    mutationFn: changePassword,
  });

  return mutation;
};

export default useMutationChangePassword;
