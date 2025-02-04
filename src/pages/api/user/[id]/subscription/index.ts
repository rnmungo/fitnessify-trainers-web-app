import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { createSubscription, getSubscriptions } from '@/services/subscription/service';
import logger from '@/utilities/loggerUtils';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Subscription } from '@/types/subscription';
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
      return {
        data: { message: 'api.subscription.error.exists' },
        detailedError: message,
        status,
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
  res: NextApiResponse<Array<Subscription> | HttpResponse>,
) {
  const id = req.query.id as string;

  if (req.method === 'GET') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const subscriptions = await getSubscriptions({ id, token: session.authorization.token });

      res.status(HTTP_STATUS.OK).json(subscriptions);
    } catch (error: unknown) {
      const { status, data, detailedError } = handleError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, detailedError });

      res.status(status).json(data);
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const { planId } = req.body;
      await createSubscription({ planId, userTenantId: id, token: session.authorization.token });

      res.status(HTTP_STATUS.OK).json({ message: 'api.subscription.create-success' });
    } catch (error: unknown) {
      const { status, data, detailedError } = handleError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, detailedError });

      res.status(status).json(data);
    }
  }
}
