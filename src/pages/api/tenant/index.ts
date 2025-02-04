import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { handleCommonError } from '@/core/error/error-handler';
import { getTenantConfiguration } from '@/services/tenant/service';
import logger from '@/utilities/loggerUtils';
import { sessionOptions } from '@/utilities/session/options';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';
import type { TenantConfiguration } from '@/services/adapters/tenant/types';

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
      const { status, data, detailedError } = handleCommonError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, detailedError });

      res.status(status).json(data);
    }

  }
}
