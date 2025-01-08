import { UI_LOGIN_KEY } from '@/constants/local-storage-keys';
import type { SessionOptions } from "iron-session";

const oneDayInSeconds = 60 * 60 * 24 * 1;

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || '',
  cookieName: UI_LOGIN_KEY,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
  ttl: oneDayInSeconds,
};
