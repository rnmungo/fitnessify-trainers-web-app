import { HTTP_STATUS } from '@/constants/http-status';
import { gatewayClient } from '../rest-clients';
import { adaptProfile } from '../adapters/profile';

export type GetMyProfileParams = {
  token: string;
};

export type ChangePasswordParams = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  token: string;
};

export const getMyProfile = async ({ token }: GetMyProfileParams) => {
  const response = await gatewayClient.get(
    '/api/user/me/profile',
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return adaptProfile(response.data);
};

export const changePassword = async ({ currentPassword, newPassword, confirmPassword, token }: ChangePasswordParams) => {
  const response = await gatewayClient.post(
    '/api/account/change-password',
    {
      currentPassword,
      newPassword,
      confirmPassword,
    },
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.status === HTTP_STATUS.OK;
};
