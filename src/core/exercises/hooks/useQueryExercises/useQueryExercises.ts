import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';
import type { Exercise } from '@/types/exercise';

const getExercises = async (): Promise<Array<Exercise>> => {
  const response = await internalClient.get('/exercise');
  return response.data;
};

const useQueryExercises = (): UseQueryResult<Array<Exercise>, Error> => {
  const query = useQuery<Array<Exercise>, Error>({
    queryKey: ['exercises'],
    queryFn: getExercises,
    enabled: true,
  });

  return query;
};

export default useQueryExercises;
