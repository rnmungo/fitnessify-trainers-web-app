import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { internalClient } from '@/services/rest-clients';
import type { MuscleGroup } from '@/types/exercise';

const getMuscleGroups = async (): Promise<Array<MuscleGroup>> => {
  const response = await internalClient.get('/muscle-group');
  return response.data;
};

const useQueryMuscleGroups = (): UseQueryResult<Array<MuscleGroup>, Error> => {
  const query = useQuery<Array<MuscleGroup>, Error>({
    queryKey: ['muscle-groups'],
    queryFn: getMuscleGroups,
    enabled: true,
  });

  return query;
};

export default useQueryMuscleGroups;
