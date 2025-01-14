export interface PlanResponse {
  name: string;
};

export interface SubscriptionResponse {
  id: string;
  status: string;
  dueDate: string;
  planId: string;
  plan: PlanResponse;
};
