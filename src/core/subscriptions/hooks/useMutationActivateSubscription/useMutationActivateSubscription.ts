import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HTTP_STATUS } from '@/constants/http-status';
import { internalClient } from '@/services/rest-clients';

interface ActivateSubscriptionParams {
  id: string;
}

const activateSubscription = async ({ id }: ActivateSubscriptionParams): Promise<boolean> => {
  const response = await internalClient.patch(`/subscription/${id}/activate`);
  return response.status === HTTP_STATUS.OK;
};

const useMutationActivateSubscription = (): UseMutationResult<boolean, unknown, ActivateSubscriptionParams, unknown> => {
  const mutation = useMutation<boolean, unknown, ActivateSubscriptionParams, unknown>({
    mutationFn: activateSubscription,
  });

  return mutation;
};

export default useMutationActivateSubscription;
