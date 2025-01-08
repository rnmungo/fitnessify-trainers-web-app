import { gatewayClient } from '../rest-clients';
import { adaptMuscleGroups } from '../adapters/muscle-group';

export type GetMuscleGroupsParams = {
  token: string;
};

export const getMuscleGroups = async ({ token }: GetMuscleGroupsParams) => {
  const response = await gatewayClient.get(
    '/api/muscle-group',
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return adaptMuscleGroups(response.data || []);
};
