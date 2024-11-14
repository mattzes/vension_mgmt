import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const res = await fetch(new URL('/api/verifyToken', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    });

    if (res.ok) {
      const { userEmail, userId } = await res.json();

      const response = await NextResponse.next();
      response.headers.set('x-user-uid', userId);
      response.headers.set('x-user-email', userEmail);
      return response;
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error during authorization' }, { status: 401 });
  }
}

// Specify routes you want to protect
export const config = {
  matcher: ['/api/freezer/:path*', '/api/animal/:path*', '/api/price/:path*', '/api/item/:path*'], // Adjust route pattern as needed
};
