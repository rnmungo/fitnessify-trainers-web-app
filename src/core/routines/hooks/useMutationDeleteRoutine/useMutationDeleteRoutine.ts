import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface DeleteRoutineParams {
  id: string;
}

const deleteRoutine = async ({ id }: DeleteRoutineParams) => {
  const response = await internalClient.delete(`/routine/${id}`);

  return response.status === HTTP_STATUS.NO_CONTENT;
};

const useMutationDeleteRoutine = (): UseMutationResult<boolean, unknown, DeleteRoutineParams, unknown> => {
  const mutation = useMutation<boolean, unknown, DeleteRoutineParams, unknown>({
    mutationFn: deleteRoutine,
  });

  return mutation;
};

export default useMutationDeleteRoutine;
