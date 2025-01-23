import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';
import type { CreateRoutine } from '@/types/routine';

type UpdateRoutineParams = {
  id: string;
  payload: CreateRoutine;
};

const updateRoutine = async ({ id, payload }: UpdateRoutineParams): Promise<boolean> => {
  const response = await internalClient.put(`/routine/${id}`, payload);
  return response.status === HTTP_STATUS.NO_CONTENT;
};

const useMutationUpdateRoutine = (): UseMutationResult<boolean, unknown, UpdateRoutineParams, unknown> => {
  const mutation = useMutation<boolean, unknown, UpdateRoutineParams, unknown>({
    mutationFn: updateRoutine,
  });

  return mutation;
};

export default useMutationUpdateRoutine;
