import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/util/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-uid');
    const querySnapshot = await db.collection('animalParts').where('userId', '==', userId).get();
    const animalParts = querySnapshot.docs.map(doc => ({
      ...doc.data(),
    }));

    const prices = [];
    for (const animalPart of animalParts) {
      for (const [key, value] of Object.entries(animalPart.parts)) {
        prices.push({
          animal: animalPart.name,
          animalPart: key,
          price: value,
        });
      }
    }

    return NextResponse.json(prices);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
