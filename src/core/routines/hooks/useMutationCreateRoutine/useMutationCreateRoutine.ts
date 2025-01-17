import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';
import type { CreateRoutine } from '@/types/routine';

const createRoutine = async (payload: CreateRoutine): Promise<boolean> => {
  const response = await internalClient.post('/routine', payload);
  return response.status === HTTP_STATUS.OK;
};

const useMutationCreateRoutine = (): UseMutationResult<boolean, unknown, CreateRoutine, unknown> => {
  const mutation = useMutation<boolean, unknown, CreateRoutine, unknown>({
    mutationFn: createRoutine,
  });

  return mutation;
};

export default useMutationCreateRoutine;
