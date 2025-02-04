import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { activateSubscription } from '@/services/subscription/service';
import logger from '@/utilities/loggerUtils';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

const defaultErrorMessage = 'api.common.error.unknown-error';
const defaultStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;

type HandleErrorResult = {
  data: HttpResponse;
  detailedError: string;
  status: number;
}

const handleError = (error: unknown): HandleErrorResult => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ errorCode?: string; errorMessage?: string; }>;

    const message = axiosError.response?.data?.errorMessage || defaultErrorMessage;
    const status = axiosError.response?.status || defaultStatus;

    if (status === HTTP_STATUS.CONFLICT) {
      const matches = message.match(/You already have an active subscription/);
      const matchError =  matches ? 'api.subscription.error.already-active' : defaultErrorMessage;

      return {
        data: { message: matchError },
        detailedError: message,
        status: HTTP_STATUS.CONFLICT,
      };
    }

    return {
      data: { message },
      detailedError: message,
      status,
    };
  }

  const errorMessage = error instanceof Error ? error.message : defaultErrorMessage;

  return {
    data: { message: defaultErrorMessage },
    detailedError: errorMessage,
    status: defaultStatus,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse>,
) {
  if (req.method === 'PATCH') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const id = req.query.id as string;
      await activateSubscription({ id, token: session.authorization.token });

      res.status(HTTP_STATUS.OK).json({ message: 'api.subscription.activate-success' });
    } catch (error: unknown) {
      const { status, data, detailedError } = handleError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, detailedError });

      res.status(status).json(data);
    }
  }
}
