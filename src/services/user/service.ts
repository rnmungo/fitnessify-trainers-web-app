import { urlParamsToQueryString } from '@/utilities/url.utility';
import { gatewayClient } from '../rest-clients';
import { adaptPagedUsers } from '../adapters/user';
import { adaptProfile } from '../adapters/profile';

type IdentifierParam = {
  id: string;
}

type TokenParam = {
  token: string;
};

type FiltersParam = {
  filters: Record<string, string>;
};

export type SearchUsersParams = FiltersParam & TokenParam;

export type GetUserProfileParams = IdentifierParam & TokenParam;

export const searchUsers = async ({ token, filters }: SearchUsersParams) => {
  const queryString = urlParamsToQueryString(filters);
  const response = await gatewayClient.get(
    `/api/user/search?${queryString}`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return adaptPagedUsers(response.data);
};

export const getUserProfile = async ({ token, id }: GetUserProfileParams) => {
  const response = await gatewayClient.get(
    `/api/user/${id}/profile`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return adaptProfile(response.data);
};
