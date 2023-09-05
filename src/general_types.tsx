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
