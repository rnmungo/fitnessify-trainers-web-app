import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { handleCommonError } from '@/core/error/error-handler';
import { searchUsers } from '@/services/user/service';
import logger from '@/utilities/loggerUtils';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@/types/user';
import type { Paged } from '@/types/paging';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Paged<User> | HttpResponse>,
) {
  if (req.method === 'GET') {
    try {
      const page = req.query.page as string;
      const pageSize = req.query.pageSize as string;
      const email = req.query.email as string;
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const pagedUsers = await searchUsers({ token: session.authorization.token, filters: { page, pageSize, email } });

      res.status(HTTP_STATUS.OK).json(pagedUsers);
    } catch (error: unknown) {
      const { status, data, detailedError } = handleCommonError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, detailedError });

      res.status(status).json(data);
    }
  }
}
