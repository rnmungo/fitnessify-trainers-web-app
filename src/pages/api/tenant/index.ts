import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { getTenantConfiguration } from '@/services/tenant/service';
import { sessionOptions } from '@/utilities/session/options';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';
import type { TenantConfiguration } from '@/services/adapters/tenant/types';

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
  res: NextApiResponse<TenantConfiguration | HttpResponse>,
) {
  if (req.method === 'POST') {
    try {
      const { tenantKey } = req.body;
      const { applicationId } = await getTenantConfiguration({ tenantId: tenantKey, isTest: true });
      const session = await getIronSession<Session>(req, res, sessionOptions);
      await session.save();

      res.status(HTTP_STATUS.OK).json({ applicationId });
    } catch (error: unknown) {
      const { status, data } = handleError(error);

      res.status(status).json(data);
    }

  }
}
