import type { Plan } from '@/types/plan';
import type { PlanResponse, PlanSpecificationResponse, PlanVariantResponse } from './types';

export const adaptPlan = (data?: PlanResponse): Plan => ({
  id: data?.id || '',
  name: data?.name || '',
  specifications: (data?.specifications || []).map((specification: PlanSpecificationResponse) => ({
    id: specification.id,
    description: specification.description,
  })),
  variants: (data?.variants || []).map((variant: PlanVariantResponse) => ({
    id: variant.id,
    name: variant.name,
    price: variant.price,
    quantity: variant.quantity,
  })),
});
