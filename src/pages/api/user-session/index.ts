import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { sessionOptions} from '@/utilities/session/options';
import { Session } from '@/types/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Session>,
) {
  if (req.method === 'GET') {
    const session = await getIronSession<Session>(req, res, sessionOptions);

    res.status(HTTP_STATUS.OK).json(session);
  }
}
