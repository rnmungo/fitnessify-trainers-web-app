import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';
import type { Plan } from '@/types/plan';

const getPlans = async (): Promise<Array<Plan>> => {
  const response = await internalClient.get('/plan');
  return response.data;
};

const useQueryPlans = (): UseQueryResult<Array<Plan>, Error> => {
  const query = useQuery<Array<Plan>, Error>({
    queryKey: ['plans'],
    queryFn: getPlans,
    enabled: true,
  });

  return query;
};

export default useQueryPlans;
