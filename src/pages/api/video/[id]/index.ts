import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { handleCommonError } from '@/core/error/error-handler';
import { deleteVideo } from '@/services/video/service';
import logger from '@/utilities/loggerUtils';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse>,
) {
  if (req.method === 'DELETE') {
    const id = req.query.id as string;

    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      await deleteVideo({ id, token: session.authorization.token });

      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'api.video.delete-success' });
    } catch (error: unknown) {
      const { status, data, detailedError } = handleCommonError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, detailedError });

      res.status(status).json(data);
    }
  }
}
