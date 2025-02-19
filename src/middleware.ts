import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Configure which paths the middleware will run on
export const config = {
  matcher: ['/api/:path*'],
}; 