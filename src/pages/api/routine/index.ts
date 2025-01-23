import { getIronSession } from 'iron-session';
import { createRoutine, getRoutines } from '@/services/routine/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Routine } from '@/types/routine';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Routine> | HttpResponse>,
) {
  if (req.method === 'GET') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const routines = await getRoutines({ token: session.authorization.token });

      res.status(200).json(routines);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'api.common.error.unknown-error';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const { name, description, duration, level, equipment, routineSections } = req.body;
      await createRoutine({ name, description, duration, level, equipment, routineSections, token: session.authorization.token });

      res.status(200).json({ message: 'api.routine.create-success' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'api.common.error.unknown-error';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
