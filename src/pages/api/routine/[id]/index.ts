import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { deleteRoutine, updateRoutine } from '@/services/routine/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

const defaultMessage = 'api.common.error.unknown-error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse>,
) {
  if (req.method === 'PUT') {
    try {
      const id = req.query.id as string;
      const session = await getIronSession<Session>(req, res, sessionOptions);

      const { name, description, duration, level, equipment, routineSections } = req.body;

      await updateRoutine({
        id,
        name,
        description,
        duration,
        level,
        equipment,
        routineSections,
        token: session.authorization.token,
      });

      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'api.routine.update-success' });
    } catch (error: unknown) {
      const internalErrorStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const errorMessage = error instanceof Error ? error.message : defaultMessage;
      const errorStatus = error instanceof Error && 'response' in error
        ? (error.response as any)?.status || internalErrorStatus
        : internalErrorStatus;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query.id as string;
      const session = await getIronSession<Session>(req, res, sessionOptions);

      await deleteRoutine({
        id,
        token: session.authorization.token,
      });

      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'api.routine.delete-success' });
    } catch (error: unknown) {
      const internalErrorStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const errorMessage = error instanceof Error ? error.message : defaultMessage;
      const errorStatus = error instanceof Error && 'response' in error
        ? (error.response as any)?.status || internalErrorStatus
        : internalErrorStatus;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
