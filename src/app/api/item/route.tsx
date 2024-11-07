import { NextRequest, NextResponse } from 'next/server';
import { collection, Timestamp, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/util/firebaseConfig';
import { getPrice } from '@/app/api/price/route';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // validate data

    const dataToStore = {
      ...data,
      date: Timestamp.fromDate(new Date(data.date)),
    };

    const docRef = await addDoc(collection(db, 'item'), dataToStore);
    const docSnap = await getDoc(docRef);
    const createdData = docSnap.data();

    const animalPrice = await getPrice(createdData.animal, createdData.animalPart);

    if (!animalPrice.success) {
      return NextResponse.json({ message: animalPrice.error }, { status: animalPrice.status });
    }

    const item = {
      id: docSnap.id,
      ...createdData,
      date: createdData.date.seconds * 1000 + createdData.date.nanoseconds / 1000000,
      price: animalPrice.price,
    };

    return NextResponse.json({ item: item, message: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    // validate data

    const { id, ...dataToUpdate } = data;

    const docRef = doc(db, 'item', id);

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Return a message if the document doesn't exist
      return NextResponse.json({ error: `No document found to update with id: ${id}` }, { status: 404 });
    }

    await updateDoc(docRef, dataToUpdate);

    return NextResponse.json({ message: 'success' }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const docRef = doc(db, 'item', id);

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Return a message if the document doesn't exist
      return NextResponse.json({ error: `No document found to delete with id: ${id}` }, { status: 404 });
    }

    await deleteDoc(docRef);

    return NextResponse.json({ message: 'success' }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
