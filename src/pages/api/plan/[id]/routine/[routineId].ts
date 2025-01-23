import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { deletePlanRoutine } from '@/services/plan/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

const defaultMessage = 'api.common.error.unknown-error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse>,
) {
  if (req.method === 'DELETE') {
    try {
      const planId = req.query.id as string;
      const routineId = req.query.routineId as string;
      const session = await getIronSession<Session>(req, res, sessionOptions);

      await deletePlanRoutine({
        planId,
        routineId,
        token: session.authorization.token,
      });

      res.status(HTTP_STATUS.OK).json({ message: 'api.plan-routine.delete-success' });
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
