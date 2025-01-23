import type { BaseSession } from '@/types/session';

export const defaultSession: BaseSession = {
  applicationId: '',
  isLoggedIn: false,
  authorization: {
    expires: 0,
    issuedAt: 0,
    token: '',
  },
  user: {
    id: '',
    email: '',
    roles: [],
    tenant: '',
  },
};
