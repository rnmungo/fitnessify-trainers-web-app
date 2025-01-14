import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface CancelSubscriptionParams {
  id: string;
}

const cancelSubscription = async ({ id }: CancelSubscriptionParams): Promise<boolean> => {
  const response = await internalClient.patch(`/subscription/${id}/cancel`);
  return response.status === HTTP_STATUS.OK;
};

const useMutationCancelSubscription = (): UseMutationResult<boolean, unknown, CancelSubscriptionParams, unknown> => {
  const mutation = useMutation<boolean, unknown, CancelSubscriptionParams, unknown>({
    mutationFn: cancelSubscription,
  });

  return mutation;
};

export default useMutationCancelSubscription;
