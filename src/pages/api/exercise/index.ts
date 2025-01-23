import { getIronSession } from 'iron-session';
import { createExercise, getExercises } from '@/services/exercise/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Exercise } from '@/types/exercise';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Exercise> | HttpResponse>,
) {
  if (req.method === 'GET') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const exercises = await getExercises({ token: session.authorization.token });

      res.status(200).json(exercises);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'api.common.error.unknown-error';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const { name, description, muscleGroups, videoId } = req.body;
      await createExercise({ name, description, muscleGroups, videoId, token: session.authorization.token });

      res.status(200).json({ message: 'api.exercise.create-success' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'api.common.error.unknown-error';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
