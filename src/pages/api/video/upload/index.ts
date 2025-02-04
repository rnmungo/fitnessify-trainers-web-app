import { getIronSession } from 'iron-session';
import { HTTP_STATUS } from '@/constants/http-status';
import { handleCommonError } from '@/core/error/error-handler';
import multer from 'multer';
import { VIDEO_FILE_EXTENSIONS, VIDEO_FILE_MAX_SIZE } from '@/constants/file-extensions';
import { uploadVideo } from '@/services/video/service';
import logger from '@/utilities/loggerUtils';
import { sessionOptions } from '@/utilities/session/options';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { HttpResponse } from '@/types/response';
import type { Session } from '@/types/session';

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
      const { status, data, detailedError } = handleCommonError(error);

      logger.error('Error handler', { error, endpoint: req.url, status, detailedError });

      res.status(status).json(data);
    }
  }
}
