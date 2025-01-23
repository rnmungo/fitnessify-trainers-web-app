import type { User } from '@/types/user';
import type { Paged } from '@/types/paging';
import type { PagedUserResponse, UserResponse } from './types';

export const adaptPagedUsers = (data?: PagedUserResponse): Paged<User> => ({
  results: (data?.results || []).map((user: UserResponse) => ({
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  })),
  currentPage: data?.currentPage || 0,
  sizeLimit: data?.sizeLimit || 0,
  total: data?.total || 0,
  pages: data?.pages || 0,
});
