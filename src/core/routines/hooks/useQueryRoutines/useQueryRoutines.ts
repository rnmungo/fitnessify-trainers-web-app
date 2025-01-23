import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';
import type { Routine } from '@/types/routine';

const getRoutines = async (): Promise<Array<Routine>> => {
  const response = await internalClient.get('/routine');
  return response.data;
};

const useQueryRoutines = (): UseQueryResult<Array<Routine>, Error> => {
  const query = useQuery<Array<Routine>, Error>({
    queryKey: ['routines'],
    queryFn: getRoutines,
    enabled: true,
  });

  return query;
};

export default useQueryRoutines;
