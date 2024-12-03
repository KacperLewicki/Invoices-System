import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import middlewareAuth from '../middleware_auth';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  return middlewareAuth(request);
}

export const config = {

  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/invoiceList',
    '/createInvoice',
    '/administrator',
    '/news',
  ],
};
