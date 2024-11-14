import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/util/firebaseAdmin';

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  try {
    const check = await auth.verifyIdToken(token);

    if (!check) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ userEmail: check.email, userId: check.uid, message: 'Authorized' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
