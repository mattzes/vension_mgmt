import { BasicEntity, Price, Freezer } from './general_types';

export const animals: BasicEntity[] = [
  {
    id: 1,
    name: 'Reh',
  },
  {
    id: 2,
    name: 'Wildschwein',
  },
];

export const meats: BasicEntity[] = [
  {
    id: 1,
    name: 'Rücken',
  },
  {
    id: 2,
    name: 'Keule',
  },
  {
    id: 3,
    name: 'Schulter',
  },
  {
    id: 4,
    name: 'Brust',
  },
];

export const freezers: Freezer[] = [
  {
    id: 1,
    name: 'Gefrierschrank 1',
    drawer_numbers: 10,
  },
  {
    id: 2,
    name: 'Gefrierschrank 2',
    drawer_numbers: 5,
  },
  {
    id: 3,
    name: 'Gefrierschrank 3',
    drawer_numbers: 8,
  },
];

export const prices: Price[] = [
  {
    id: 1,
    animal_id: 1,
    meat_id: 1,
    price: 10.0,
  },
  {
    id: 2,
    animal_id: 1,
    meat_id: 2,
    price: 15.0,
  },
  {
    id: 3,
    animal_id: 2,
    meat_id: 3,
    price: 8.5,
  },
  {
    id: 4,
    animal_id: 2,
    meat_id: 4,
    price: 5.0,
  },
  {
    id: 5,
    animal_id: 1,
    meat_id: 5,
    price: 7.5,
  },
];
