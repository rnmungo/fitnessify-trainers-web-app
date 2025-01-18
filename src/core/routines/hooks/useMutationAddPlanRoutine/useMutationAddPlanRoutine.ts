import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface AddPlanRoutineParams {
  planId: string;
  routineId: string;
};

const addPlanRoutine = async ({ planId, routineId }: AddPlanRoutineParams): Promise<boolean> => {
  const response = await internalClient.post(`/plan/${planId}/routine`, { routineId });
  return response.status === HTTP_STATUS.OK;
};

const useMutationAddPlanRoutine = (): UseMutationResult<boolean, unknown, AddPlanRoutineParams, unknown> => {
  const mutation = useMutation<boolean, unknown, AddPlanRoutineParams, unknown>({
    mutationFn: addPlanRoutine,
  });

  return mutation;
};

export default useMutationAddPlanRoutine;
