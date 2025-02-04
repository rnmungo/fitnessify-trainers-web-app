import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { handleCommonError } from '@/core/error/error-handler';
import { addPlanRoutine } from '@/services/plan/service';
import logger from '@/utilities/loggerUtils';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse>,
) {
  if (req.method === 'POST') {
    try {
      const planId = req.query.id as string;
      const routineId = req.body.routineId as string;
      const session = await getIronSession<Session>(req, res, sessionOptions);

      await addPlanRoutine({
        planId,
        routineId,
        token: session.authorization.token,
      });

      res.status(HTTP_STATUS.OK).json({ message: 'api.plan-routine.create-success' });
    } catch (error: unknown) {
      const { status, data, detailedError } = handleCommonError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, detailedError });

      res.status(status).json(data);
    }
  }
}
