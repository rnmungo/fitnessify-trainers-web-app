import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await internalClient.post('/video/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

  return response.status === HTTP_STATUS.OK;
};

const useMutationUploadVideo = (): UseMutationResult<boolean, unknown, File, unknown> => {
  const mutation = useMutation<boolean, unknown, File, unknown>({
    mutationFn: uploadVideo,
  });

  return mutation;
};

export default useMutationUploadVideo;
