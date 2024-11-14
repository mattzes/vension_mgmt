import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/util/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-uid');
    const freezerSnapshot = await db.collection('freezer').where('userId', '==', userId).get();
    const freezers = freezerSnapshot.docs.map(doc => {
      const { userId, ...data } = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    const animalSnapshot = await db.collection('animalParts').where('userId', '==', userId).get();
    const animals = animalSnapshot.docs.map(doc => doc.data());

    const findPrice = (animalName: string, animalPart: string) => {
      const animal = animals.find(animal => animal.name === animalName);
      return animal && animal.parts ? animal.parts[animalPart] : 0;
    };

    const freezerWithItems = [];

    for (const freezer of freezers) {
      const itemSnapshot = await db
        .collection('item')
        .where('freezerId', '==', freezer.id)
        .where('userId', '==', userId)
        .get();

      const items = itemSnapshot.docs.map(doc => {
        const { userId, ...data } = doc.data();
        return {
          id: doc.id,
          price: findPrice(data.animal, data.animalPart),
          ...data,
          date: data.date.seconds * 1000 + data.date.nanoseconds / 1000000,
        };
      });

      freezerWithItems.push({
        ...freezer,
        vensions: items,
      });
    }

    return NextResponse.json(freezerWithItems);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
