import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ar'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: SupportedLocale = 'en';

function getPreferredLocale(req: NextRequest): SupportedLocale {
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value as SupportedLocale | undefined;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  const accept = req.headers.get('accept-language') || '';
  const lowered = accept.toLowerCase();
  if (lowered.includes('ar')) return 'ar';
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip next internals, assets and API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    /\.[\w]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/');
  const first = segments[1];

  // If URL already has locale prefix → set cookie and let next.config rewrites handle mapping
  if (SUPPORTED_LOCALES.includes(first as SupportedLocale)) {
    const locale = first as SupportedLocale;
    const res = NextResponse.next();
    res.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  // No locale prefix → redirect to preferred locale, preserving path, query and hash
  const preferred = getPreferredLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${preferred}${pathname}`;
  url.search = search;
  const res = NextResponse.redirect(url);
  res.cookies.set('NEXT_LOCALE', preferred, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};


