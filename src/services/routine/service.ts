import { HTTP_STATUS } from '@/constants/http-status';
import { gatewayClient } from '../rest-clients';
import { adaptRoutine, adaptRoutines, adaptRoutinePlan } from '../adapters/routine';

import type { CreateRoutine } from '@/types/routine';

type IdentifierParam = {
  id: string;
}

type TokenParam = {
  token: string;
}

export type ActivateRoutineParams = IdentifierParam & TokenParam;

export type CreateRoutineParams = CreateRoutine & TokenParam;

export type UpdateRoutineParams = IdentifierParam & CreateRoutine & TokenParam;

export type DeactivateRoutineParams = IdentifierParam & TokenParam;

export type DeleteRoutineParams = IdentifierParam & TokenParam;

export type GetRoutinesParams = TokenParam;

export type GetRoutineParams = IdentifierParam & TokenParam;

export type GetRoutinePlansParams = IdentifierParam & TokenParam;

export const activateRoutine = async ({ token, id }: ActivateRoutineParams) => {
  const response = await gatewayClient.put(
    `/api/routine/${id}/deploy`,
    {},
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.NO_CONTENT;
};

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

export const updateRoutine = async ({ id, name, description, duration, level, equipment, routineSections, token }: UpdateRoutineParams) => {
  const response = await gatewayClient.put(
    `/api/routine/${id}`,
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

  return response.status === HTTP_STATUS.NO_CONTENT;
};

export const deactivateRoutine = async ({ token, id }: DeactivateRoutineParams) => {
  const response = await gatewayClient.put(
    `/api/routine/${id}/draft`,
    {},
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.NO_CONTENT;
};

export const deleteRoutine = async ({ id, token }: DeleteRoutineParams) => {
  const response = await gatewayClient.delete(
    `/api/routine/${id}`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.NO_CONTENT;
};

export const getRoutinePlans = async ({ id, token }: GetRoutinePlansParams) => {
  const response = await gatewayClient.get(
    `/api/routine/${id}/plan`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const plans = response.data || [];

  return plans.map(adaptRoutinePlan);
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

export const getRoutine = async ({ id, token }: GetRoutineParams) => {
  const response = await gatewayClient.get(
    `/api/routine/${id}`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return adaptRoutine(response.data);
};
