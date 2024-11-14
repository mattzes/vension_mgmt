import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/util/firebaseAdmin';

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  const check = await firebaseAdmin.auth().verifyIdToken(token);

  console.log('check', check);

  return NextResponse.json({ message: 'ok' }, { status: 200 });
}
