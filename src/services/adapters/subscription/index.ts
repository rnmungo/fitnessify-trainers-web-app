import type { Subscription } from '@/types/subscription';
import type { SubscriptionResponse } from './types';

export const adaptSubscription = (data?: SubscriptionResponse): Subscription => ({
  id: data?.id || '',
  status: data?.status || '',
  dueDate: data?.dueDate || '',
  planId: data?.planId || '',
  planName: data?.plan?.name || '',
});
