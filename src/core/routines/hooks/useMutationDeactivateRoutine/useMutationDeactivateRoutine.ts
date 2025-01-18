import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface DeactivateRoutineParams {
  id: string;
}

const deactivateRoutine = async ({ id }: DeactivateRoutineParams): Promise<boolean> => {
  const response = await internalClient.put(`/routine/${id}/draft`);
  return response.status === HTTP_STATUS.OK;
};

const useMutationDeactivateRoutine = (): UseMutationResult<boolean, unknown, DeactivateRoutineParams, unknown> => {
  const mutation = useMutation<boolean, unknown, DeactivateRoutineParams, unknown>({
    mutationFn: deactivateRoutine,
  });

  return mutation;
};

export default useMutationDeactivateRoutine;
