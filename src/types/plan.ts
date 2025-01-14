export type PlanSpecification = {
  id: string;
  description: string;
};

export type PlanVariant = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Plan = {
  id: string;
  name: string;
  specifications: Array<PlanSpecification>;
  variants: Array<PlanVariant>;
};
