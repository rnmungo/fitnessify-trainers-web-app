import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface DeletePlanRoutineParams {
  planId: string;
  routineId: string;
};

const deletePlanRoutine = async ({ planId, routineId }: DeletePlanRoutineParams): Promise<boolean> => {
  const response = await internalClient.delete(`/plan/${planId}/routine/${routineId}`);
  return response.status === HTTP_STATUS.OK;
};

const useMutationDeletePlanRoutine = (): UseMutationResult<boolean, unknown, DeletePlanRoutineParams, unknown> => {
  const mutation = useMutation<boolean, unknown, DeletePlanRoutineParams, unknown>({
    mutationFn: deletePlanRoutine,
  });

  return mutation;
};

export default useMutationDeletePlanRoutine;
