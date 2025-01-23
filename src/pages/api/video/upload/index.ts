import { getIronSession } from 'iron-session';
import multer from 'multer';
import { VIDEO_FILE_EXTENSIONS, VIDEO_FILE_MAX_SIZE } from '@/constants/file-extensions';
import { uploadVideo } from '@/services/video/service';
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
      return cb(new Error('Tipo de archivo no permitido. Solo se permiten videos del tipo mp4, webm y ogg.'));
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
        return res.status(400).json({ message: 'No se encontró ningún archivo en la solicitud' });
      }

      const { file } = req;

      try {
        await uploadVideo({
          file,
          token: session.authorization.token,
        });

        return res.status(200).json({ message: 'Video subido correctamente' });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;

        res.status(errorStatus).json({ message: (error as any)?.response?.data?.message || errorMessage });
      }
    } catch (error: any) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
          message: 'api.video.upload.error.limit-exceeded',
        });
        return;
      }

      res.status(500).json({ message: error.message || 'An internal server error occurred' });
    }
  }
}
