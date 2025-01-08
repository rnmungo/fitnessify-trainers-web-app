import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/utilities/session/options';
import { defaultSession } from '@/constants/session';
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

      res.status(200).json(defaultSession.user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
