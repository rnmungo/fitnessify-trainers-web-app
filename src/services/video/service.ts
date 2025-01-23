import FormData from 'form-data';
import { HTTP_STATUS } from '@/constants/http-status';
import { gatewayClient } from '../rest-clients';
import { adaptVideos } from '../adapters/exercise';

export type DeleteVideoParams = {
  id: string;
  token: string;
};

export type GetVideosParams = {
  token: string;
};

export type UploadVideoParams = {
  file: Express.Multer.File;
  token: string;
}

export const getVideos = async ({ token }: GetVideosParams) => {
  const response = await gatewayClient.get(
    '/api/video',
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return adaptVideos(response.data || []);
};

export const uploadVideo = async ({ file, token }: UploadVideoParams) => {
  const formData = new FormData();

  formData.append('file', file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  const response = await gatewayClient.post(
    '/api/video',
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.OK;
};

export const deleteVideo = async ({ id, token }: DeleteVideoParams) => {
  const response = await gatewayClient.delete(
    `/api/video/${id}`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.NO_CONTENT;
};
