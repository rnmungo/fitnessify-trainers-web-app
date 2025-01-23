import { getIronSession } from 'iron-session';
import { TRAINER_ROLE } from '@/core/auth/constants/roles';
import { signIn } from '@/services/auth/service';
import { getMyProfile } from '@/services/profile/service';
import { sessionOptions } from '@/utilities/session/options';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session, User } from '@/types/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | HttpResponse>,
) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      const { authorization, isLoggedIn, user } = await signIn({ email, password });

      if (!user.roles.includes(TRAINER_ROLE)) {
        throw new Error('api.auth.sign-in.error.not-authorized');
      }

      const profile = await getMyProfile({ token: authorization.token });

      const session = await getIronSession<Session>(req, res, sessionOptions);
      session.authorization = authorization;
      session.isLoggedIn = isLoggedIn;
      session.user = user;
      session.profile = profile;

      await session.save();

      res.status(200).json(user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'api.common.error.unknown-error';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }
  }
}
