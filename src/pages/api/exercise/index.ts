import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { createExercise, getExercises } from '@/services/exercise/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Exercise } from '@/types/exercise';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

const defaultErrorMessage = 'api.common.error.unknown-error';
const defaultStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;

type HandleErrorResult = {
  status: number;
  data: HttpResponse;
}

const handleError = (error: unknown): HandleErrorResult => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ errorCode?: string; errorMessage?: string; }>;

    const message = axiosError.response?.data?.errorMessage || defaultErrorMessage;
    const status = axiosError.response?.status || defaultStatus;

    return { status, data: { message } };
  }

  const errorMessage = error instanceof Error ? error.message : defaultErrorMessage;
  return { status: defaultStatus, data: { message: errorMessage } };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Exercise> | HttpResponse>,
) {
  if (req.method === 'GET') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const exercises = await getExercises({ token: session.authorization.token });

      res.status(HTTP_STATUS.OK).json(exercises);
    } catch (error: unknown) {
      const { status, data } = handleError(error);

      res.status(status).json(data);
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const { name, description, muscleGroups, videoId } = req.body;
      await createExercise({ name, description, muscleGroups, videoId, token: session.authorization.token });

      res.status(HTTP_STATUS.OK).json({ message: 'api.exercise.create-success' });
    } catch (error: unknown) {
      const { status, data } = handleError(error);

      res.status(status).json(data);
    }
  }
}
