export type FreezerWithVensions = {
  id: string;
  name: string;
  drawerNumbers: number;
  vensions: Vensions[];
};

export type Freezer = {
  id: string;
  name: string;
  drawerNumbers: number;
};

export type Price = {
  animal: string;
  animalPart: string;
  price: number;
};

export type Vensions = {
  id: string;
  freezerId: string;
  drawerNumber: number | string;
  animal: string;
  animalPart: string;
  weight: number;
  count: number;
  date: string;
  price: number;
  reservedFor: string;
};
