import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Klucz JWT (upewnij się, że jest dobrze zabezpieczony w środowisku produkcyjnym)
const JWT_SECRET = new TextEncoder().encode('123456');

export async function middleware(request) {
  console.log('Middleware wywołane dla:', request.nextUrl.pathname);

  // Pobranie tokena z ciasteczek
  const token = request.cookies.get('token')?.value;
  console.log('Token:', token);

  // Ścieżki publiczne, które nie wymagają autoryzacji
  const publicPaths = ['/login', '/register', '/favicon.ico'];

  // Jeśli użytkownik próbuje uzyskać dostęp do publicznej ścieżki, pozwalamy na dostęp
  if (publicPaths.includes(request.nextUrl.pathname)) {
    console.log('Ścieżka publiczna, dostęp dozwolony.');
    return NextResponse.next();
  }

  // Jeśli token istnieje, sprawdź, czy jest prawidłowy
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      console.log('Token jest prawidłowy, dostęp dozwolony.');
      return NextResponse.next();
    } catch (err) {
      console.error('Token jest nieprawidłowy, przekierowanie na /login.');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    // Jeśli brak tokena, przekieruj na stronę logowania
    console.log('Brak tokena, przekierowanie na /login.');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Konfiguracja middleware - obejmuje wszystkie ścieżki
export const config = {
  matcher: ['/invoiceList', '/dashboard', '/api/:path*'],
};
