import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { getStatusTranslation } from '@/core/subscriptions/utilities/subscriptionUtils';
import { createSubscription, getSubscriptions } from '@/services/subscription/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Subscription } from '@/types/subscription';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

type HandleErrorResult = {
  status: number;
  data: HttpResponse;
}

const handleError = (error: unknown): HandleErrorResult => {
  const axiosError = error as AxiosError<{ errorCode?: string; errorMessage?: string; }>;
  if (axiosError.response?.status === HTTP_STATUS.CONFLICT) {
    const errorMessage = axiosError.response?.data?.errorMessage || '';
    const matches = errorMessage.match(/\b(Draft|Active|Canceled|Paused)\b/);
    const subscriptionStatus =  matches ? matches[0] : 'Draft';
    const statusTranslated = getStatusTranslation(subscriptionStatus);
    return { status: HTTP_STATUS.CONFLICT, data: { message: `La subscripción ya existe en estado "${statusTranslated}"` } };
  }

  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, data: { message: errorMessage } };
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

      res.status(200).json(subscriptions);
    } catch (error: unknown) {
      const { status, data } = handleError(error);
      res.status(status).json(data);
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const { planId } = req.body;
      await createSubscription({ planId, userTenantId: id, token: session.authorization.token });

      res.status(200).json({ message: 'Subscription created successfully' });
    } catch (error: unknown) {
      const { status, data } = handleError(error);
      res.status(status).json(data);
    }
  }
}
