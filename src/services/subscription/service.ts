import { HTTP_STATUS } from '@/constants/http-status';
import { gatewayClient } from '../rest-clients';
import { adaptSubscription } from '../adapters/subscription';

type IdentifierParam = {
  id: string;
}

type TokenParam = {
  token: string;
};

type DueDateParam = {
  days: number;
};

type SubscriptionDataParam = {
  planId: string;
  userTenantId: string;
};

export type GetSubscriptionParams = IdentifierParam & TokenParam;

export type CreateSubscriptionParams = SubscriptionDataParam & TokenParam;

export type ActivateSubscriptionParams = IdentifierParam & TokenParam;

export type CancelSubscriptionParams = IdentifierParam & TokenParam;

export type IncrementDueDateSubscriptionParams = IdentifierParam & TokenParam & DueDateParam;

export const getSubscriptions = async ({ token, id }: GetSubscriptionParams) => {
  const response = await gatewayClient.get(
    `/api/subscription/user-tenant/${id}`,
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.map(adaptSubscription);
};

export const createSubscription = async ({ planId, userTenantId, token }: CreateSubscriptionParams) => {
  const response = await gatewayClient.post(
    '/api/subscription',
    {
      planId,
      userTenantId,
    },
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.OK;
};

export const activateSubscription = async ({ token, id }: ActivateSubscriptionParams) => {
  const response = await gatewayClient.patch(
    `/api/subscription/${id}/activate`,
    {},
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.NO_CONTENT;
};

export const cancelSubscription = async ({ token, id }: CancelSubscriptionParams) => {
  const response = await gatewayClient.patch(
    `/api/subscription/${id}/cancel`,
    {},
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.NO_CONTENT;
};

export const incrementDueDateSubscription = async ({ token, id, days }: IncrementDueDateSubscriptionParams) => {
  const response = await gatewayClient.patch(
    `/api/subscription/${id}/increment-due-date`,
    { days },
    {
      headers: {
        'X-Application-Id': process.env.TENANT,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.status === HTTP_STATUS.NO_CONTENT;
};
