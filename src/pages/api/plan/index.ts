import { getIronSession } from 'iron-session';
import { getPlans } from '@/services/plan/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Plan } from '@/types/plan';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Plan> | HttpResponse>,
) {
  if (req.method === 'GET') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const plans = await getPlans({ token: session.authorization.token });

      res.status(200).json(plans);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'api.common.error.unknown-error';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
