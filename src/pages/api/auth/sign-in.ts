import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { TRAINER_ROLE } from '@/core/auth/constants/roles';
import { signIn } from '@/services/auth/service';
import { getMyProfile } from '@/services/profile/service';
import { sessionOptions } from '@/utilities/session/options';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session, User } from '@/types/session';

const defaultErrorMessage = 'api.common.error.unknown-error';
const defaultStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;

type HandleErrorResult = {
  status: number;
  data: HttpResponse;
}

const handleError = (error: unknown): HandleErrorResult => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ errorCode?: string; errorMessage?: string; }>;

    const message = axiosError.response?.data?.errorMessage || defaultErrorMessage;
    const status = axiosError.response?.status || defaultStatus;

    return { status, data: { message } };
  }

  const errorMessage = error instanceof Error ? error.message : defaultErrorMessage;
  return { status: defaultStatus, data: { message: errorMessage } };
};

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

      res.status(HTTP_STATUS.OK).json(user);
    } catch (error: unknown) {
      const { status, data } = handleError(error);

      res.status(status).json(data);
    }
  }
}
