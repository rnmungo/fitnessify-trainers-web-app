import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

const deleteVideo = async (id: string) => {
  const response = await internalClient.delete(`/video/${id}`);

  return response.status === HTTP_STATUS.NO_CONTENT;
};

const useMutationDeleteVideo = (): UseMutationResult<boolean, unknown, string, unknown> => {
  const mutation = useMutation<boolean, unknown, string, unknown>({
    mutationFn: deleteVideo,
  });

  return mutation;
};

export default useMutationDeleteVideo;
