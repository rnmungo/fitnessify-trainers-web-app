import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface ExerciseParams {
  name: string;
  description: string;
  videoId: string;
  muscleGroups: Array<string>;
}

const createExercise = async ({ name, description, videoId, muscleGroups }: ExerciseParams): Promise<boolean> => {
  const response = await internalClient.post('/exercise', {
    name,
    description,
    videoId,
    muscleGroups,
  });
  return response.status === HTTP_STATUS.OK;
};

const useMutationCreateExercise = (): UseMutationResult<boolean, unknown, ExerciseParams, unknown> => {
  const mutation = useMutation<boolean, unknown, ExerciseParams, unknown>({
    mutationFn: createExercise,
  });

  return mutation;
};

export default useMutationCreateExercise;
