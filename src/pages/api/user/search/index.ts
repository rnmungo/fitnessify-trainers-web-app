import { getIronSession } from 'iron-session';
import { searchUsers } from '@/services/user/service';
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

      res.status(200).json(pagedUsers);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
