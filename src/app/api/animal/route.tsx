import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/util/firebaseConfig';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'animalParts'));
    const animals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(animals);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
