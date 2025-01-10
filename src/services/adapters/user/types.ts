export interface UserResponse {
  id: string;
  name: string;
  lastName: string;
  email: string;
};

export interface PagedUserResponse {
  results: Array<UserResponse>;
  currentPage: number;
  sizeLimit: number;
  total: number;
  pages: number;
};
