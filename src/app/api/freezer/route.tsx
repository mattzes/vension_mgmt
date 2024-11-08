import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/util/firebaseConfig';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, where, query } from 'firebase/firestore';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'freezer'));
    const freezers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(freezers);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // validate data

    const docRef = await addDoc(collection(db, 'freezer'), data);

    return NextResponse.json({ id: docRef.id, message: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    // validate data

    const { id, ...dataToUpdate } = data;

    const freezerRef = doc(db, 'freezer', id);

    const docSnap = await getDoc(freezerRef);
    if (!docSnap.exists()) {
      // Return a message if the document doesn't exist
      return NextResponse.json({ message: `Es konnte kein Dokument zu den Daten gefunden Werden.` }, { status: 404 });
    }

    const itemsRef = collection(db, 'item');
    const itemsQuery = query(itemsRef, where('freezerId', '==', id), where('drawerNumber', '>', dataToUpdate.drawerCount));
    const itemSnapshot = await getDocs(itemsQuery);
    if (!itemSnapshot.empty) {
      return NextResponse.json(
        {
          message: 'Die Anzahl der Schubladen kann nicht reduziert werden, da Gegenstände in den Schubladen vorhanden sind.',
        },
        { status: 409 }
      );
    }

    await updateDoc(freezerRef, dataToUpdate);

    return NextResponse.json({ message: 'success' }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const freezerRef = doc(db, 'freezer', id);

    const docSnap = await getDoc(freezerRef);
    if (!docSnap.exists()) {
      // Return a message if the document doesn't exist
      return NextResponse.json({ error: 'Es wurde kein Dokument zu den Daten gefunden' }, { status: 404 });
    }

    const itemsRef = collection(db, 'item');
    const itemsQuery = query(itemsRef, where('freezerId', '==', id));
    const itemSnapshot = await getDocs(itemsQuery);
    const deletePromises = itemSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    await deleteDoc(freezerRef);

    return NextResponse.json({ message: 'success' }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
