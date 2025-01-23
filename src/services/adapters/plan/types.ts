export type PlanSpecificationResponse = {
  id: string;
  description: string;
};

export type PlanVariantResponse = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type PlanResponse = {
  id: string;
  name: string;
  specifications: Array<PlanSpecificationResponse>;
  variants: Array<PlanVariantResponse>;
};
