import { NextResponse } from 'next/server';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/util/firebaseConfig';

export async function GET() {
  try {
    const freezerSnapshot = await getDocs(collection(db, 'freezer'));
    const freezers = freezerSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const animalSnapshot = await getDocs(collection(db, 'animalParts'));
    const animals = animalSnapshot.docs.map(doc => doc.data());

    const findPrice = (animalName: string, animalPart: string) => {
      const animal = animals.find(animal => animal.name === animalName);
      return animal && animal.parts ? animal.parts[animalPart] : 0;
    };

    const freezerWithItems = [];

    for (const freezer of freezers) {
      const itemsRef = collection(db, 'item');
      const itemsQuery = query(itemsRef, where('freezerId', '==', freezer.id));
      const itemSnapshot = await getDocs(itemsQuery);

      const items = itemSnapshot.docs.map(doc => {
        const data = doc.data();
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
