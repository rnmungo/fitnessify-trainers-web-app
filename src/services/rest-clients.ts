import { isTestScope } from '@/utilities/environment.utility';
import RestClientFactory from './rest-client-factory';

const isTest = isTestScope();

const gatewayClient = new RestClientFactory(process.env.FITNESSIFY_GATEWAY_URL)
  .setTimeout(isTest ? 60000 : 10000)
  .extendHeaders({
    'X-Api-Test': isTest,
    'Accept-Language': 'es',
  })
  .create();

gatewayClient.interceptors.response.use(
  response => response,
  e => {
    if (e.response?.status >= 400 && e.response?.status < 500) {
      if (e.response?.data?.Value) {
        // TODO: Map error messages
        const { errorMessage } = e.response.data?.Value;
        e.response.data.message = errorMessage;
      }
    }

    return Promise.reject(e);
  },
);

const internalClient = new RestClientFactory('/api')
  .setTimeout(isTest ? 60000 : 10000)
  .create();

export { gatewayClient, internalClient };
