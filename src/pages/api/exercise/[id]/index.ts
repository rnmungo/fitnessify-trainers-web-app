import { getIronSession } from 'iron-session';
import { deleteExercise, updateExercise } from '@/services/exercise/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse>,
) {
  const id = req.query.id as string;

  if (req.method === 'PUT') {
    try {
      const { name, description, muscleGroups, videoId } = req.body;
      const session = await getIronSession<Session>(req, res, sessionOptions);

      await updateExercise({
        id,
        name,
        description,
        muscleGroups,
        videoId,
        token: session.authorization.token,
      });

      res.status(204).json({ message: 'Ejercicio actualizado correctamente' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query.id as string;
      const session = await getIronSession<Session>(req, res, sessionOptions);

      await deleteExercise({
        id,
        token: session.authorization.token,
      });

      res.status(204).json({ message: 'Ejercicio eliminado correctamente' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
