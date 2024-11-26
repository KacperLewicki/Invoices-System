import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Klucz JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '123456');

export async function middleware(request: NextRequest) {

  //console.log('Middleware uruchomione dla:', request.nextUrl.pathname);

  // Pobranie tokena z ciasteczek
  const token = request.cookies.get('token')?.value;
  console.log('Token:', token);

  // Wyjątek dla strony logowania
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/') {

    //console.log('Ścieżka /login, dostęp dozwolony.');

    return NextResponse.next();
  }

  // Sprawdzanie tokena
  if (token) {

    try {

      // Weryfikacja tokena
      await jwtVerify(token, JWT_SECRET);

      //console.log('Token prawidłowy, dostęp dozwolony.');

      return NextResponse.next();
    } catch (err) {

      //console.error('Nieprawidłowy token. Przekierowanie na /login.');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  //console.log('Brak tokena, przekierowanie na /login.');
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/invoiceList','/createInvoice','/administrator','/news'], // Dopasowanie wszystkich ścieżek
};
