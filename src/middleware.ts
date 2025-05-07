// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, locales, cookieName } from './lib/i18n/settings'; // Provjerite putanju

acceptLanguage.languages([...locales]); // Osigurajte da je locales niz stringova

export const config = {
  // Matcher izbjegava rute za api, _next/static, _next/image, assets, favicon.ico, sw.js
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'
  ]
};

export function middleware(req: NextRequest) {
  let lng: string | undefined | null;

  // 1. Pokušaj dohvatiti jezik iz cookie-ja
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  }
  // 2. Ako nema u cookie-ju, pokušaj iz 'Accept-Language' zaglavlja
  if (!lng && req.headers.has('Accept-Language')) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  }
  // 3. Ako ni to ne uspije, koristi zadani jezik
  if (!lng) {
    lng = fallbackLng;
  }

  const pathname = req.nextUrl.pathname;

  // Provjeri nedostaje li podržani jezik u putanji
  const pathnameIsMissingLocale = locales.every(
    (loc) => !pathname.startsWith(`/${loc}/`) && pathname !== `/${loc}`
  );

  if (pathnameIsMissingLocale) {
    // Preusmjeri ako jezik nedostaje u URL-u (npr. s '/' na '/hr')
    // Osiguraj da se query parametri zadrže
    const newUrl = new URL(`/${lng}${pathname.startsWith('/') ? '' : '/'}${pathname}`, req.url);
    newUrl.search = req.nextUrl.search; // Kopiraj query parametre
    return NextResponse.redirect(newUrl);
  }

  // Ako je jezik u URL-u, ali se razlikuje od preferiranog (iz cookie-ja ili zaglavlja),
  // spremi preferirani jezik u cookie za buduće posjete
  if (lng && (!req.cookies.has(cookieName) || req.cookies.get(cookieName)?.value !== lng)) {
    const response = NextResponse.next();
    response.cookies.set(cookieName, lng, { path: '/' });
    return response;
  }

  return NextResponse.next();
}
