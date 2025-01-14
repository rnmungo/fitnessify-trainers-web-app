import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface IncrementDueDateSubscriptionParams {
  id: string;
  days: number;
}

const incrementDueDateSubscription = async ({ id, days }: IncrementDueDateSubscriptionParams): Promise<boolean> => {
  const response = await internalClient.patch(`/subscription/${id}/increment-due-date`, {
    days,
  });
  return response.status === HTTP_STATUS.OK;
};

const useMutationIncrementDueDateSubscription = (): UseMutationResult<boolean, unknown, IncrementDueDateSubscriptionParams, unknown> => {
  const mutation = useMutation<boolean, unknown, IncrementDueDateSubscriptionParams, unknown>({
    mutationFn: incrementDueDateSubscription,
  });

  return mutation;
};

export default useMutationIncrementDueDateSubscription;
