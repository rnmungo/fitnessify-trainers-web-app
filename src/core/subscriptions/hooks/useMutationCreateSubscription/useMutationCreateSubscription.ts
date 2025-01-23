import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface SubscriptionParams {
  planId: string;
  userTenantId: string;
}

const createSubscription = async ({ planId, userTenantId }: SubscriptionParams): Promise<boolean> => {
  const response = await internalClient.post(`/user/${userTenantId}/subscription`, {
    planId,
  });
  return response.status === HTTP_STATUS.OK;
};

const useMutationCreateSubscription = (): UseMutationResult<boolean, unknown, SubscriptionParams, unknown> => {
  const mutation = useMutation<boolean, unknown, SubscriptionParams, unknown>({
    mutationFn: createSubscription,
  });

  return mutation;
};

export default useMutationCreateSubscription;
