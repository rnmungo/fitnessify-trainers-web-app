import { jwtDecode } from 'jwt-decode';
import { defaultSession } from '@/constants/session';
import type { BaseSession } from '@/types/session';
import type { AuthorizationData, DecodedToken } from './types';

export const adaptAuthorization = (data: AuthorizationData = {}): BaseSession => {
  if (data?.token) {
    const decodedToken = jwtDecode<DecodedToken>(data.token);
    const {
      sub: userId,
      email,
      exp: expires,
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': roles,
      iat: issuedAt,
      tenant,
    } = decodedToken;

    return {
      applicationId: tenant,
      isLoggedIn: true,
      authorization: {
        expires,
        issuedAt,
        refreshToken: data?.refreshToken,
        token: data?.token,
      },
      user: {
        id: userId,
        email,
        roles,
        tenant,
      },
    };
  }

  return defaultSession;
};
