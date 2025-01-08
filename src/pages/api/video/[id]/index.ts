import { getIronSession } from 'iron-session';
import { deleteVideo } from '@/services/video/service';
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

      res.status(204).json({ message: 'Video eliminado correctamente' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
