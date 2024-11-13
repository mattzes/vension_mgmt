import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  const response = await fetch(new URL('/api/verifyToken', req.url).toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token }),
  });

  return NextResponse.next();
}

// Specify routes you want to protect
export const config = {
  matcher: ['/api/freezer/:path*'], // Adjust route pattern as needed
};
