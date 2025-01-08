import { gatewayClient } from '../rest-clients';
import { adaptTenantConfiguration } from '../adapters/tenant';
import type { TenantConfiguration } from '../adapters/tenant/types';

export type GetTenantParams = {
  tenantId: string;
  isTest: boolean;
};

const tenantMap = new Map([
  ['beblackfit', 'personal-trainer-beblackfit'],
  ['test-tenant', 'personal-trainer-beblackfit'],
]);

export const getTenantConfiguration = async ({ tenantId, isTest }: GetTenantParams): Promise<TenantConfiguration> => {
  if (isTest) {
    return {
      applicationId: tenantMap.get(tenantId) || '',
    };
  }

  const response = await gatewayClient.get(
    `/api/tenant/${tenantId}`,
  );
  return adaptTenantConfiguration(response.data);
};
