export type FreezerWithVensions = {
  id: string;
  name: string;
  drawerCount: number;
  vensions: Vension[];
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

export type Vension = {
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

export type VensionToDB = Omit<Vension, 'price'> & { date: number };

export const pepareVensionForDB = (vension: Vension): VensionToDB => {
  const data = { ...vension, date: new Date(vension.date).getTime() } as any;
  delete data.price;

  return data;
};
