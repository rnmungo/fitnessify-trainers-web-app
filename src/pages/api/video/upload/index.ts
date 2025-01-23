import { AxiosError } from 'axios';
import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import multer from 'multer';
import { VIDEO_FILE_EXTENSIONS, VIDEO_FILE_MAX_SIZE } from '@/constants/file-extensions';
import { uploadVideo } from '@/services/video/service';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

const defaultErrorMessage = 'api.common.error.internal-error';
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

  if ((error as any)?.code === 'LIMIT_FILE_SIZE') {
    return { status: HTTP_STATUS.BAD_REQUEST, data: { message: 'api.video.error.limit-exceeded' } };
  }

  const errorMessage = error instanceof Error ? error.message : defaultErrorMessage;
  return { status: defaultStatus, data: { message: errorMessage } };
};

interface MulterNextApiRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: VIDEO_FILE_MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!VIDEO_FILE_EXTENSIONS.includes(file.mimetype)) {
      return cb(new Error('api.video.error.invalid-file-extension'));
    }

    cb(null, true);
  },
});

const multerMiddleware = upload.single('file');

function runMiddleware(req: MulterNextApiRequest, res: NextApiResponse, callback: any) {
  return new Promise((resolve, reject) => {
    callback(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: MulterNextApiRequest, res: NextApiResponse<HttpResponse>) {
  if (req.method === 'POST') {
    try {
      const session = await getIronSession<Session>(req, res, sessionOptions);

      await runMiddleware(req, res, multerMiddleware);

      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'api.video.error.file-not-found' });
      }

      const { file } = req;

      await uploadVideo({
        file,
        token: session.authorization.token,
      });

      return res.status(HTTP_STATUS.OK).json({ message: 'api.video.upload-success' });
    } catch (error: any) {
      const { status, data } = handleError(error);

      res.status(status).json(data);
    }
  }
}
