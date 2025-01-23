import { HTTP_STATUS } from '@/constants/http-status';
import { gatewayClient } from '../rest-clients';
import { adaptPlan } from '../adapters/plan';

type TokenParam = {
  token: string;
};

type PlanRoutineParam = {
  planId: string;
  routineId: string;
};

export type GetPlansParams = TokenParam;

export type AddPlanRoutineParams = PlanRoutineParam & TokenParam;

export type DeletePlanRoutineParams = PlanRoutineParam & TokenParam;

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

export const addPlanRoutine = async ({ planId, routineId, token }: AddPlanRoutineParams) => {
  const response = await gatewayClient.post(
    `/api/plan/${planId}/routine`,
    {
      routineId,
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

export const deletePlanRoutine = async ({ planId, routineId, token }: DeletePlanRoutineParams) => {
  const response = await gatewayClient.delete(
    `/api/plan/${planId}/routine/${routineId}`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.OK;
};
