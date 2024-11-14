import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/util/firebaseAdmin';

export const getPrice = async (animal: string, animalPart: string, userId: string) => {
  const animalPartsSnapshot = await db
    .collection('animalParts')
    .where('name', '==', animal)
    .where('userId', '==', userId)
    .get();

  if (animalPartsSnapshot.empty) {
    return { success: false, message: 'Animal does not exist', status: 409 };
  } else if (animalPartsSnapshot.docs.length > 1) {
    return { success: false, message: 'Multiple documents found', status: 500 };
  } else {
    const docData = animalPartsSnapshot.docs[0].data();
    if (!docData.parts[animalPart]) {
      return { success: false, message: 'Animal part does not exist', status: 409 };
    }
    return { success: true, price: docData.parts[animalPart] };
  }
};

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-uid') ?? '';
    const animal = req.nextUrl.searchParams.get('animal') ?? '';
    const animalPart = req.nextUrl.searchParams.get('animalPart') ?? '';
    const result = await getPrice(animal, animalPart, userId);

    if (result.success) {
      return NextResponse.json({ animal, animalPart, price: result.price });
    } else {
      return NextResponse.json({ message: result.message }, { status: result.status });
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { animal, animalPart, price } = await req.json();
    const userId = req.headers.get('x-user-uid');
    const animalPartsSnapshot = await db
      .collection('animalParts')
      .where('name', '==', animal)
      .where('userId', '==', userId)
      .get();

    if (animalPartsSnapshot.empty) {
      await db.collection('animalParts').add({ name: animal, parts: { [animalPart]: price }, userId: userId });
      return NextResponse.json({ message: 'success' }, { status: 201 });
    } else if (animalPartsSnapshot.docs.length > 1) {
      return NextResponse.json({ message: 'Es wurden zu viele Einträge gefunden.' }, { status: 500 });
    } else {
      const docRef = animalPartsSnapshot.docs[0].ref;
      const docData = animalPartsSnapshot.docs[0].data();
      if (docData.parts[animalPart]) {
        return NextResponse.json({ message: `Fleischart existiert bereits für dieses Tier: ${animal}` }, { status: 409 });
      }
      await docRef.update({
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
    const userId = req.headers.get('x-user-uid');
    const animalPartsSnapshot = await db
      .collection('animalParts')
      .where('name', '==', animal)
      .where('userId', '==', userId)
      .get();

    if (animalPartsSnapshot.empty) {
      return NextResponse.json({ message: 'Tierart wurde nicht gefunden.' }, { status: 409 });
    } else if (animalPartsSnapshot.docs.length > 1) {
      return NextResponse.json({ message: 'Es wurden zu viele Einträge gefunden.' }, { status: 500 });
    } else {
      const docRef = animalPartsSnapshot.docs[0].ref;
      const docData = animalPartsSnapshot.docs[0].data();
      if (!docData.parts[animalPart]) {
        return NextResponse.json({ message: `Fleischart existiert nicht für das Tier: ${animal}` }, { status: 409 });
      }
      await docRef.update({
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
    const userId = req.headers.get('x-user-uid');
    const animalPartsSnapshot = await db
      .collection('animalParts')
      .where('name', '==', animal)
      .where('userId', '==', userId)
      .get();

    if (animalPartsSnapshot.empty) {
      return NextResponse.json({ message: 'Es wurde kein Dokument zu den Daten gefunden' }, { status: 404 });
    } else if (animalPartsSnapshot.docs.length > 1) {
      return NextResponse.json({ message: 'Es wurden mehrer Einträge mit diesen Daten gefunden.' }, { status: 500 });
    } else {
      const animalPartData = animalPartsSnapshot.docs[0].data();
      const toUpdateAnimalPart = animalPartsSnapshot.docs[0].ref;

      if (!animalPartData.parts[animalPart]) {
        return NextResponse.json({ message: 'Die Fleischart wurde nicht gefunden' }, { status: 404 });
      }

      if (Object.keys(animalPartData.parts).length === 1) {
        await toUpdateAnimalPart.delete();
        return NextResponse.json({ message: 'success' }, { status: 202 });
      }

      if (Object.keys(animalPartData.parts).length > 1) {
        const newParts = { ...animalPartData.parts };
        delete newParts[animalPart];
        await toUpdateAnimalPart.update({
          parts: newParts,
        });
      }
    }

    return NextResponse.json({ message: 'success' }, { status: 202 });
    1;
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
