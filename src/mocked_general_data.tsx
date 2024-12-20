import { Price, FreezerWithVensions, Freezer, Animal } from './general_types';

export const freezers_only: Freezer[] = [
  {
    id: '1',
    name: 'Gefrierschrank 1',
    drawerCount: 10,
  },
  {
    id: '2',
    name: 'Gefrierschrank 2',
    drawerCount: 5,
  },
  {
    id: '3',
    name: 'Gefrierschrank 3',
    drawerCount: 8,
  },
];

export const freezers: FreezerWithVensions[] = [
  {
    id: '1',
    name: 'Gefrierschrank 1',
    drawerCount: 10,
    vensions: [
      {
        id: '1',
        freezerId: '1',
        drawerNumber: 'Nicht zugewiesen',
        animal: 'Reh',
        animalPart: 'Keule',
        weight: 380,
        count: 2,
        date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
        price: 10.0,
        reservedFor: '',
      },
      {
        id: '8',
        freezerId: '1',
        drawerNumber: 'Nicht zugewiesen',
        animal: 'Reh',
        animalPart: 'Keule',
        weight: 600,
        count: 2,
        date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
        price: 7.5,
        reservedFor: '',
      },
      {
        id: '9',
        freezerId: '1',
        drawerNumber: 4,
        animal: 'Wildschwein',
        animalPart: 'Rücken',
        weight: 1100,
        count: 1,
        date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
        price: 10.0,
        reservedFor: 'Hans',
      },
      {
        id: '10',
        freezerId: '1',
        drawerNumber: 1,
        animal: 'Reh',
        animalPart: 'Brust',
        weight: 340,
        count: 3,
        date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
        price: 15.0,
        reservedFor: '',
      },
      {
        id: '11',
        freezerId: '1',
        drawerNumber: 3,
        animal: 'Wildschwein',
        animalPart: 'Keule',
        weight: 850,
        count: 2,
        date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
        price: 5.0,
        reservedFor: '',
      },
      {
        id: '12',
        freezerId: '1',
        drawerNumber: 5,
        animal: 'Reh',
        animalPart: 'Rücken',
        weight: 920,
        count: 1,
        date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
        price: 10.0,
        reservedFor: 'Silke',
      },
      // Weitere Einträge
    ],
  },
  {
    id: '2',
    name: 'Gefrierschrank 2',
    drawerCount: 5,
    vensions: [
      {
        id: '1',
        freezerId: '2',
        drawerNumber: 'Nicht zugewiesen',
        animal: 'Reh',
        animalPart: 'Keule',
        weight: 380,
        count: 2,
        date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
        price: 10.0,
        reservedFor: '',
      },
      {
        id: '8',
        freezerId: '2',
        drawerNumber: 'Nicht zugewiesen',
        animal: 'Reh',
        animalPart: 'Keule',
        weight: 600,
        count: 2,
        date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
        price: 7.5,
        reservedFor: '',
      },
      {
        id: '9',
        freezerId: '2',
        drawerNumber: 4,
        animal: 'Wildschwein',
        animalPart: 'Rücken',
        weight: 1100,
        count: 1,
        date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
        price: 10.0,
        reservedFor: 'Hans',
      },
      // Weitere Einträge
    ],
  },
  {
    id: '3',
    name: 'Gefrierschrank 3',
    drawerCount: 8,
    vensions: [],
  },
];

export const prices: Price[] = [
  {
    animal: 'Reh',
    animalPart: 'Rücken',
    price: 10.0,
  },
  {
    animal: 'Reh',
    animalPart: 'Keule',
    price: 15.0,
  },
  {
    animal: 'Wildschwein',
    animalPart: 'Schulter',
    price: 8.5,
  },
  {
    animal: 'Wildschwein',
    animalPart: 'Brust',
    price: 5.0,
  },
  {
    animal: 'Reh',
    animalPart: 'Brust',
    price: 7.5,
  },
];

export const animals: Animal[] = [
  {
    name: 'Reh',
    parts: {
      Rücken: 10.0,
      Keule: 15.0,
      Brust: 7.5,
    },
  },
  {
    name: 'Hirsch',
    parts: {
      Rücken: 12.0,
      Keule: 17.0,
      Brust: 8.5,
    },
  },
];
