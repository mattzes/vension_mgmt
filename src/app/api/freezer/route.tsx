import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/util/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-uid');
    const querySnapshot = await db.collection('freezer').where('userId', '==', userId).get();
    const freezers = querySnapshot.docs.map(doc => {
      const { userId, ...data } = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    return NextResponse.json(freezers);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const userId = req.headers.get('x-user-uid');

    // validate data
    data.userId = userId;

    const docRef = await db.collection('freezer').add(data);

    return NextResponse.json({ id: docRef.id, message: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const userId = req.headers.get('x-user-uid');

    // validate data

    const { id, ...dataToUpdate } = data;

    const freezerRef = db.collection('freezer').doc(id);
    const freezerSnap = await freezerRef.get();

    if (!freezerSnap.exists || freezerSnap.data()?.userId !== userId) {
      // Return a message if the document doesn't exist
      return NextResponse.json({ message: `Es konnte kein Dokument zu den Daten gefunden Werden.` }, { status: 404 });
    }

    const itemSnapshot = await db
      .collection('item')
      .where('freezerId', '==', id)
      .where('userId', '==', userId)
      .where('drawerNumber', '>=', dataToUpdate.drawerCount)
      .get();
    if (!itemSnapshot.empty) {
      return NextResponse.json(
        {
          message: 'Die Anzahl der Schubladen kann nicht reduziert werden, da Gegenstände in den Schubladen vorhanden sind.',
        },
        { status: 409 }
      );
    }

    await freezerRef.update(dataToUpdate);

    return NextResponse.json({ message: 'success' }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const userId = req.headers.get('x-user-uid');

    const freezerRef = db.collection('freezer').doc(id);
    const freezerSnap = await freezerRef.get();

    if (!freezerSnap.exists || freezerSnap.data()?.userId !== userId) {
      // Return a message if the document doesn't exist
      return NextResponse.json({ error: 'Es wurde kein Dokument zu den Daten gefunden' }, { status: 404 });
    }

    const itemSnapshot = await db.collection('item').where('freezerId', '==', id).where('userId', '==', userId).get();
    const deletePromises = itemSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    await freezerRef.delete();

    return NextResponse.json({ message: 'success' }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
