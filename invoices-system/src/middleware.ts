import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {

  const NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR: any = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);
  const token = request.cookies.get('token')?.value;

  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/') {

    return NextResponse.next();
  }
  if (token) {

    try {

      await jwtVerify(token, NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);
      return NextResponse.next();

    } catch (err) {

      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.redirect(new URL('/login', request.url));
}
export const config = {

  matcher: ['/invoiceList', '/createInvoice', '/administrator', '/news'],
};
