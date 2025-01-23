import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { changePassword } from '@/services/profile/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

type HandleErrorResult = {
  status: number;
  data: HttpResponse;
}

const defaultMessage = 'api.common.error.unknown-error';

const handleError = (error: unknown): HandleErrorResult => {
  const axiosError = error as AxiosError<{ errorCode?: string; errorMessage?: string; }>;
  if (axiosError.response?.status === HTTP_STATUS.BAD_REQUEST) {
    const errorMessage = axiosError.response?.data?.errorMessage || '';
    return { status: HTTP_STATUS.BAD_REQUEST, data: { message: errorMessage } };
  }

  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, data: { message: errorMessage } };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse>,
) {
  if (req.method === 'POST') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const { currentPassword, newPassword, confirmPassword } = req.body;
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
        token: session.authorization.token,
      });

      res.status(200).json({ message: 'api.change-password.update-success' });
    } catch (error: unknown) {
      const { status, data } = handleError(error);
      res.status(status).json(data);
    }
  }
}
