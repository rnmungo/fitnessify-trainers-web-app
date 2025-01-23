import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { cancelSubscription } from '@/services/subscription/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

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
  res: NextApiResponse<HttpResponse>,
) {
  if (req.method === 'PATCH') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const id = req.query.id as string;
      await cancelSubscription({ id, token: session.authorization.token });

      res.status(HTTP_STATUS.OK).json({ message: 'api.subscription.canceled-success' });
    } catch (error: unknown) {
      const { status, data } = handleError(error);

      res.status(status).json(data);
    }
  }
}
