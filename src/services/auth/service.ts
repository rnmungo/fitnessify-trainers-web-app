import { gatewayClient } from '../rest-clients';
import { adaptAuthorization } from '../adapters/auth';

export type SignInParams = {
  email: string;
  password: string;
};

export const signIn = async ({ email, password }: SignInParams) => {
  const response = await gatewayClient.post(
    '/api/account/login',
    {
      email,
      password,
    },
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
      },
    },
  );
  return adaptAuthorization(response.data);
};
