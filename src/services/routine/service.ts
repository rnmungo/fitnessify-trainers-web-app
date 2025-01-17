import { HTTP_STATUS } from '@/constants/http-status';
import { gatewayClient } from '../rest-clients';
import { adaptRoutines } from '../adapters/routine';

import type { CreateRoutine } from '@/types/routine';

type IdentifierParam = {
  id: string;
}

type TokenParam = {
  token: string;
}

export type CreateRoutineParams = CreateRoutine & TokenParam;

export type GetRoutinesParams = TokenParam;

export const createRoutine = async ({ name, description, duration, level, equipment, routineSections, token }: CreateRoutineParams) => {
  const response = await gatewayClient.post(
    '/api/routine',
    {
      name,
      description,
      duration,
      level,
      equipment,
      routineSections,
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

export const getRoutines = async ({ token }: GetRoutinesParams) => {
  const response = await gatewayClient.get(
    '/api/routine',
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return adaptRoutines(response.data || []);
};
