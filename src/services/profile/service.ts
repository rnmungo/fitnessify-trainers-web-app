import { gatewayClient } from '../rest-clients';
import { adaptProfile } from '../adapters/profile';

export type GetMyProfileParams = {
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
