import { NextRequest, NextResponse } from 'next/server';
import { internalClient } from '@/services/rest-clients';
import type { TenantConfiguration } from '@/services/adapters/tenant/types';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|.*\\..*).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${rootDomain}`);

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes('---') &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split('---')[0]}.${rootDomain}`;
  }

  const subdomainRegex = new RegExp(`^(.*)\\.${rootDomain}$`);
  const match = hostname.match(subdomainRegex);

  const subdomain = match && match[1] ? match[1] : 'test-tenant';

  try {
    const response = await internalClient.post<TenantConfiguration>('/tenant', { tenantKey: subdomain });
    req.headers.set('x-application-id', response.data.applicationId);
    return NextResponse.next();
  } catch (error: unknown) {
    console.error('Error in middleware:', error);
    const errorStatus = error instanceof Error && 'response' in error ? (error.response as any)?.status || 500 : 500;
    if (errorStatus === 404) {
      return NextResponse.redirect(new URL('/404', req.url));
    }

    return NextResponse.redirect(new URL('/500', req.url));
  }
}
