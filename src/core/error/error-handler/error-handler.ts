import { AxiosError } from 'axios';
import { HTTP_STATUS } from '@/constants/http-status';
import { ApiError } from './api-error';
import type { HttpResponse } from '@/types/response';

type HandleErrorResult = {
  data: HttpResponse;
  detailedError: string;
  status: number;
}

const defaultErrorMessage = 'api.common.error.unknown-error';
const defaultStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;

export const handleCommonError = (error: unknown): HandleErrorResult => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ errorCode?: string; errorMessage?: string; }>;

    const message = axiosError.response?.data?.errorMessage || defaultErrorMessage;
    const status = axiosError.response?.status || defaultStatus;

    return {
      data: { message },
      detailedError: message,
      status,
    };
  }

  if (error instanceof ApiError) {
    const errorMessage = error.message;

    return {
      data: { message: errorMessage },
      detailedError: errorMessage,
      status: defaultStatus,
    };
  }

  if ((error as any)?.code === 'LIMIT_FILE_SIZE') {
    return {
      data: { message: 'api.video.error.limit-exceeded' },
      detailedError: (error as any)?.message,
      status: HTTP_STATUS.BAD_REQUEST,
    };
  }

  const errorMessage = error instanceof Error ? error.message : defaultErrorMessage;

  return {
    data: { message: defaultErrorMessage },
    detailedError: errorMessage,
    status: defaultStatus,
  };
};
