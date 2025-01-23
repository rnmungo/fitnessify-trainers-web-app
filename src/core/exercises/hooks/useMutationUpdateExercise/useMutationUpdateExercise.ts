import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface ExerciseParams {
  id: string;
  name: string;
  description: string;
  videoId: string;
  muscleGroups: Array<string>;
}

const updateExercise = async ({ id, name, description, videoId, muscleGroups }: ExerciseParams): Promise<boolean> => {
  const response = await internalClient.put(`/exercise/${id}`, {
    name,
    description,
    videoId,
    muscleGroups,
  });

  return response.status === HTTP_STATUS.NO_CONTENT;
};

const useMutationUpdateExercise = (): UseMutationResult<boolean, unknown, ExerciseParams, unknown> => {
  const mutation = useMutation<boolean, unknown, ExerciseParams, unknown>({
    mutationFn: updateExercise,
  });

  return mutation;
};

export default useMutationUpdateExercise;
