import { getIronSession } from 'iron-session';
import { getTenantConfiguration } from '@/services/tenant/service';
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

      res.status(200).json({ applicationId });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'api.common.error.unknown-error';
      const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

      res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
    }

  }
}
