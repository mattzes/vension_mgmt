import { NextRequest, NextResponse } from 'next/server';
import { collection, Timestamp, addDoc } from 'firebase/firestore';
import { db } from '@/util/firebaseConfig';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // validate data

    const dataToStore = {
      ...data,
      date: Timestamp.fromDate(new Date(data.date)),
    };

    const docRef = await addDoc(collection(db, 'item'), dataToStore);

    return NextResponse.json({ id: docRef.id, message: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 202 });
}

export async function DELETE(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 204 });
}
