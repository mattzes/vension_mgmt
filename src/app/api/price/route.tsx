import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/util/firebaseConfig';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'animalParts'));
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

export async function POST(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 202 });
}
