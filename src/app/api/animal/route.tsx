import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/util/firebaseAdmin';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-uid');
  try {
    const querySnapshot = await db.collection('animalParts').where('userId', '==', userId).get();
    const animals = querySnapshot.docs.map(doc => {
      const { userId, ...data } = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    return NextResponse.json(animals);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
