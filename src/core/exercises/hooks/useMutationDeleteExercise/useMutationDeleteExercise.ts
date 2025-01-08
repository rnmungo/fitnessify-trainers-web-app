import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

const deleteExercise = async (id: string) => {
  const response = await internalClient.delete(`/exercise/${id}`);

  return response.status === HTTP_STATUS.NO_CONTENT;
};

const useMutationDeleteExercise = (): UseMutationResult<boolean, unknown, string, unknown> => {
  const mutation = useMutation<boolean, unknown, string, unknown>({
    mutationFn: deleteExercise,
  });

  return mutation;
};

export default useMutationDeleteExercise;
