import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/util/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { getPrice } from '@/app/api/price/route';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const userId = req.headers.get('x-user-uid');

    // Validate data here

    const dataToStore = {
      ...data,
      userId,
      date: Timestamp.fromDate(new Date(data.date)),
    };

    const docRef = await db.collection('item').add(dataToStore);
    const createdData = (await docRef.get()).data();

    if (!createdData) {
      return NextResponse.json({ message: 'Fehler beim erstellen des Gegenstandes.' }, { status: 500 });
    }

    const animalPrice = await getPrice(createdData.animal, createdData.animalPart);

    if (!animalPrice.success) {
      return NextResponse.json({ message: animalPrice.message }, { status: animalPrice.status });
    }

    delete createdData.userId;
    const item = {
      id: docRef.id,
      ...createdData,
      date: createdData.date.toMillis(),
      price: animalPrice.price,
    };

    return NextResponse.json({ item: item, message: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const userId = req.headers.get('x-user-uid');

    // validate data

    const { id, ...dataToUpdate } = data;

    const docRef = db.collection('item').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.userId !== userId) {
      return NextResponse.json({ message: 'Es wurde kein Dokument zu den Daten gefunden.' }, { status: 404 });
    }

    await docRef.update(dataToUpdate);

    return NextResponse.json({ message: 'success' }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const userId = req.headers.get('x-user-uid');

    const docRef = db.collection('item').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.userId !== userId) {
      return NextResponse.json({ message: 'Es wurde kein Dokument zu den Daten gefunden' }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ message: 'success' }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
