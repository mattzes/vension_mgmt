export type BasicEntity = {
  id: number;
  name: string;
};

export type Freezer = {
  id: number;
  name: string;
  drawer_numbers: number;
};

export type Price = {
  id: number;
  animal_id: BasicEntity['id'];
  meat_id: BasicEntity['id'];
  price: number;
};

export type Vension = {
  id: number;
  freezer_id: number;
  drawer_number: number | string;
  animal_id: BasicEntity['id'];
  meat_id: BasicEntity['id'];
  weight: number;
  count: number;
  date: string;
  price_id: Price['id'];
  reserved_for: string;
};
