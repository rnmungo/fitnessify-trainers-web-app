import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { deleteExercise, updateExercise } from '@/services/exercise/service';
import logger from '@/utilities/loggerUtils';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
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
  res: NextApiResponse<HttpResponse>,
) {
  const id = req.query.id as string;

  if (req.method === 'PUT') {
    try {
      const { name, description, muscleGroups, videoId } = req.body;
      const session = await getIronSession<Session>(req, res, sessionOptions);

      await updateExercise({
        id,
        name,
        description,
        muscleGroups,
        videoId,
        token: session.authorization.token,
      });

      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'api.exercise.update-success' });
    } catch (error: unknown) {
      const { status, data } = handleError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, data });

      res.status(status).json(data);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query.id as string;
      const session = await getIronSession<Session>(req, res, sessionOptions);

      await deleteExercise({
        id,
        token: session.authorization.token,
      });

      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'api.exercise.delete-success' });
    } catch (error: unknown) {
      const { status, data } = handleError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, data });

      res.status(status).json(data);
    }
  }
}
