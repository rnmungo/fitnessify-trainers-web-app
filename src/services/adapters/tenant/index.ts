import type { TenantConfiguration, TenantResponseData } from './types';

export const adaptTenantConfiguration = (data: TenantResponseData = {
  applicationId: ''
}): TenantConfiguration => ({
  applicationId: data.applicationId,
});
