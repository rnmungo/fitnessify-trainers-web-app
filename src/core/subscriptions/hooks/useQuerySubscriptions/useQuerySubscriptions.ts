import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';
import type { Subscription } from '@/types/subscription';

const getSubscriptions = async (id?: string): Promise<Array<Subscription>> => {
  const response = await internalClient.get(`/user/${id}/subscription`);
  return response.data;
};

const useQuerySubscriptions = (id?: string): UseQueryResult<Array<Subscription>, Error> => {
  const query = useQuery<Array<Subscription>, Error>({
    queryKey: ['subscriptions'],
    queryFn: () => getSubscriptions(id),
    enabled: !!id,
  });

  return query;
};

export default useQuerySubscriptions;
