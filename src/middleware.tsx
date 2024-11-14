import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const response = await fetch(new URL('/api/verifyToken', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    });

    if (response.ok) {
      return NextResponse.next();
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error during authorization' }, { status: 401 });
  }
}

// Specify routes you want to protect
export const config = {
  matcher: ['/api/:path*'], // Adjust route pattern as needed
};
