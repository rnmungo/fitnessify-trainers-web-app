import { getIronSession } from 'iron-session';
import { sessionOptions} from '@/utilities/session/options';
import { Session } from '@/types/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Session>,
) {
  if (req.method === 'GET') {
    const session = await getIronSession<Session>(req, res, sessionOptions);

    res.status(200).json(session);
  }
}
