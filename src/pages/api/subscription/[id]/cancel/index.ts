import { getIronSession } from 'iron-session';
import { cancelSubscription } from '@/services/subscription/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse>,
) {
  if (req.method === 'PATCH') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const id = req.query.id as string;
      await cancelSubscription({ id, token: session.authorization.token });

      res.status(200).json({ message: 'Subscription canceled successfully' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
