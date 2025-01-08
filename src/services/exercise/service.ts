import { HTTP_STATUS } from '@/constants/http-status';
import { gatewayClient } from '../rest-clients';
import { adaptExercise, adaptExercises } from '../adapters/exercise';

type IdentifierParam = {
  id: string;
}

type TokenParam = {
  token: string;
}

type ExerciseParams = {
  name: string;
  description: string;
  muscleGroups: Array<string>;
  videoId: string;
}

export type CreateExerciseParams = ExerciseParams & TokenParam;

export type GetExercisesParams = TokenParam;

export type GetExerciseParams = IdentifierParam & TokenParam;

export type UpdateExerciseParams = IdentifierParam & TokenParam & ExerciseParams;

export type DeleteExerciseParams = IdentifierParam & TokenParam;

export const createExercise = async ({ name, description, muscleGroups, token, videoId }: CreateExerciseParams) => {
  const response = await gatewayClient.post(
    '/api/exercise',
    {
      name,
      description,
      muscleGroups: muscleGroups.map((muscleGroupId) => ({ muscleGroupId })),
      videoId,
    },
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.OK;
};

export const getExercise = async ({ id, token }: GetExerciseParams) => {
  const response = await gatewayClient.get(
    `/api/exercise/${id}`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return adaptExercise(response.data);
};

export const getExercises = async ({ token }: GetExercisesParams) => {
  const response = await gatewayClient.get(
    '/api/exercise',
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return adaptExercises(response.data || []);
};

export const updateExercise = async ({ id, name, description, muscleGroups, token, videoId }: UpdateExerciseParams) => {
  const response = await gatewayClient.put(
    `/api/exercise/${id}`,
    {
      name,
      description,
      muscleGroups: muscleGroups.map((muscleGroupId) => ({ muscleGroupId })),
      videoId,
    },
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.NO_CONTENT;
};

export const deleteExercise = async ({ id, token }: DeleteExerciseParams) => {
  const response = await gatewayClient.delete(
    `/api/exercise/${id}`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.NO_CONTENT;
};
