import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
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
  try {
    const { animal, animalPart, price } = await req.json();
    const animalPartsRef = collection(db, 'animalParts');
    const animalPartsQuery = query(animalPartsRef, where('name', '==', animal));
    const animalPartsSnapshot = await getDocs(animalPartsQuery);

    if (animalPartsSnapshot.empty) {
      await addDoc(animalPartsRef, { name: animal, parts: { [animalPart]: price } });
      return NextResponse.json({ message: 'success' }, { status: 201 });
    } else if (animalPartsSnapshot.docs.length > 1) {
      return NextResponse.json({ message: 'Multiple documents found' }, { status: 500 });
    } else {
      const docRef = animalPartsSnapshot.docs[0].ref;
      await updateDoc(docRef, {
        [`parts.${animalPart}`]: price, // Use Firestore's dot notation for nested fields
      });
    }

    return NextResponse.json({ message: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 202 });
}
