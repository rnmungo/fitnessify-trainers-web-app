import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface ActivateRoutineParams {
  id: string;
}

const activateRoutine = async ({ id }: ActivateRoutineParams): Promise<boolean> => {
  const response = await internalClient.put(`/routine/${id}/deploy`);
  return response.status === HTTP_STATUS.OK;
};

const useMutationActivateRoutine = (): UseMutationResult<boolean, unknown, ActivateRoutineParams, unknown> => {
  const mutation = useMutation<boolean, unknown, ActivateRoutineParams, unknown>({
    mutationFn: activateRoutine,
  });

  return mutation;
};

export default useMutationActivateRoutine;
