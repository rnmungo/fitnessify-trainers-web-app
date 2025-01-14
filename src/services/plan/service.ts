import { gatewayClient } from '../rest-clients';
import { adaptPlan } from '../adapters/plan';

type TokenParam = {
  token: string;
};

export type GetPlansParams = TokenParam;

export const getPlans = async ({ token }: GetPlansParams) => {
  const response = await gatewayClient.get(
    '/api/plan',
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.map(adaptPlan);
};
