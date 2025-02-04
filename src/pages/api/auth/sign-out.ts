import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { defaultSession } from '@/constants/session';
import { handleCommonError } from '@/core/error/error-handler';
import logger from '@/utilities/loggerUtils';
import { sessionOptions } from '@/utilities/session/options';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session, User } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | HttpResponse>,
) {
  if (req.method === 'POST') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);

      await session.destroy();

      res.status(HTTP_STATUS.OK).json(defaultSession.user);
    } catch (error: unknown) {
      const { status, data, detailedError } = handleCommonError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, detailedError });

      res.status(status).json(data);
    }
  }
}
