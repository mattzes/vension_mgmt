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
      const docData = animalPartsSnapshot.docs[0].data();
      if (docData.parts[animalPart]) {
        return NextResponse.json({ message: 'Animal part already exists' }, { status: 409 });
      }
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
  try {
    const { animal, animalPart, price } = await req.json();
    const animalPartsRef = collection(db, 'animalParts');
    const animalPartsQuery = query(animalPartsRef, where('name', '==', animal));
    const animalPartsSnapshot = await getDocs(animalPartsQuery);

    if (animalPartsSnapshot.empty) {
      return NextResponse.json({ message: 'Animal does not exist' }, { status: 409 });
    } else if (animalPartsSnapshot.docs.length > 1) {
      return NextResponse.json({ message: 'Multiple documents found' }, { status: 500 });
    } else {
      const docRef = animalPartsSnapshot.docs[0].ref;
      const docData = animalPartsSnapshot.docs[0].data();
      if (!docData.parts[animalPart]) {
        return NextResponse.json({ message: 'Animal part does not exist' }, { status: 409 });
      }
      await updateDoc(docRef, {
        [`parts.${animalPart}`]: price, // Use Firestore's dot notation for nested fields
      });
    }

    return NextResponse.json({ message: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { animal, animalPart, price } = await req.json();
    const animalPartsRef = collection(db, 'animalParts');
    const animalPartsQuery = query(animalPartsRef, where('name', '==', animal));
    const animalPartsSnapshot = await getDocs(animalPartsQuery);

    if (animalPartsSnapshot.empty) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    } else if (animalPartsSnapshot.docs.length > 1) {
      return NextResponse.json({ message: 'Multiple documents found' }, { status: 500 });
    } else {
      const animalPartData = animalPartsSnapshot.docs[0].data();
      const toUpdateAnimalPart = animalPartsSnapshot.docs[0].ref;

      if (!animalPartData.parts[animalPart]) {
        return NextResponse.json({ message: 'Animal part not found' }, { status: 404 });
      }

      if (Object.keys(animalPartData.parts).length === 1) {
        await deleteDoc(toUpdateAnimalPart);
        return NextResponse.json({ message: 'success' }, { status: 202 });
      }

      if (Object.keys(animalPartData.parts).length > 1) {
        const newParts = { ...animalPartData.parts };
        delete newParts[animalPart];
        await updateDoc(toUpdateAnimalPart, {
          parts: newParts,
        });
      }
    }

    return NextResponse.json({ message: 'success' });
    1;
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
