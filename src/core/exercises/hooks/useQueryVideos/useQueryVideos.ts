import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';
import type { Video } from '@/types/exercise';

const getVideos = async (): Promise<Array<Video>> => {
  const response = await internalClient.get('/video');
  return response.data;
};

const useQueryVideos = (): UseQueryResult<Array<Video>, Error> => {
  const query = useQuery<Array<Video>, Error>({
    queryKey: ['videos'],
    queryFn: getVideos,
    enabled: true,
  });

  return query;
};

export default useQueryVideos;
