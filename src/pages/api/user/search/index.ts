import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { searchUsers } from '@/services/user/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@/types/user';
import type { Paged } from '@/types/paging';
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
  res: NextApiResponse<Paged<User> | HttpResponse>,
) {
  if (req.method === 'GET') {
    try {
      const page = req.query.page as string;
      const pageSize = req.query.pageSize as string;
      const email = req.query.email as string;
      const session = await getIronSession<Session>(req, res, sessionOptions);
      const pagedUsers = await searchUsers({ token: session.authorization.token, filters: { page, pageSize, email } });

      res.status(HTTP_STATUS.OK).json(pagedUsers);
    } catch (error: unknown) {
      const { status, data } = handleError(error);

      res.status(status).json(data);
    }
  }
}
