import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import isEmpty from 'lodash.isempty';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/utilities/session/options';
import type { Session } from '@/types/session';

export function withGuardPage(getServerSideProps: GetServerSideProps) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res, resolvedUrl } = context;

    const session = await getIronSession<Session>(req, res, sessionOptions);

    const now = new Date();
    const expiresTimestamp = session?.authorization?.expires;
    const dateExpired = expiresTimestamp ? new Date(expiresTimestamp * 1000) : now;
    const isExpired = dateExpired.getTime() - now.getTime() <= 10000;

    const isAuthenticated = !isEmpty(session) && session?.isLoggedIn && !isExpired;

    if (!isAuthenticated && resolvedUrl !== '/login') {
      res.setHeader('location', '/login');
      res.statusCode = 302;
      res.end();
    } else if (isAuthenticated && resolvedUrl === '/login') {
      res.setHeader('location', '/');
      res.statusCode = 302;
      res.end();
    }

    return await getServerSideProps(context);
  };
}
