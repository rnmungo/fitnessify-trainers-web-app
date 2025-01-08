import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';
import type { Session } from '@/types/session';

const getSession = async (): Promise<Session> => {
  const response = await internalClient.get('/user-session');
  return response.data;
};

const useQueryUserSession = (): UseQueryResult<Session, Error> => {
  const query = useQuery<Session, Error>({
    queryKey: ['session'],
    queryFn: getSession,
  });

  return query;
};

export default useQueryUserSession;
