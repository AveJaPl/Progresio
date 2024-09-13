import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';

export function middleware(request: NextRequest) {
  const publicPaths = ['/', '/api/login', '/api/register', '/api/logout'];
  const { pathname } = request.nextUrl;

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  const token = cookies.token;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Optionally verify token validity here

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/login|api/register|api/logout).*)'],
};
