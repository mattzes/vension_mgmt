export type FreezerWithVensions = {
  id: string;
  name: string;
  drawerCount: number;
  vensions: Vensions[];
};

export type Freezer = {
  id: string;
  name: string;
  drawerCount: number;
};

export type Price = {
  animal: string;
  animalPart: string;
  price: number;
};

export type Animal = {
  name: string;
  parts: Record<string, number>;
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
