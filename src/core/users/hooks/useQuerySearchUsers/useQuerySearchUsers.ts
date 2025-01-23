import { useState } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import useDebounce from '@/core/hooks/useDebounce';
import { internalClient } from '@/services/rest-clients';
import { urlParamsToQueryString } from '@/utilities/url.utility';
import type { Paged } from '@/types/paging';
import type { User } from '@/types/user';

type QueryFilterResult = {
  filtersState: Record<string, string>;
  setFiltersState: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

type UseQuerySearchUsersResult =
  UseQueryResult<Paged<User>, Error> &
  QueryFilterResult;

const searchUsers = async (filters: Record<string, string>): Promise<Paged<User>> => {
  const queryString = urlParamsToQueryString(filters);
  const response = await internalClient.get(`/user/search?${queryString}`);
  return response.data;
};

const useQuerySearchUsers = (filterParams: Record<string, string>): UseQuerySearchUsersResult => {
  const [filtersState, setFiltersState] = useState<Record<string, string>>(filterParams);
  const debounceFilters = useDebounce(filtersState, 500);
  const query = useQuery<Paged<User>, Error>({
    queryKey: ['search-users', debounceFilters],
    queryFn: () => searchUsers(debounceFilters),
    enabled: true,
  });

  return { ...query, filtersState: debounceFilters, setFiltersState };
};

export default useQuerySearchUsers;
