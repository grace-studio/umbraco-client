import { randomUUID } from 'crypto';
import { UmbracoClientConfig } from '../types';

export const throwError = (message: string, ...otherMessages: string[]) => {
  console.error(...otherMessages);
  throw new Error(`UmbracoClient: ${message}`);
};

export const validateConfig = (config: UmbracoClientConfig) => {
  if (!config) {
    throwError('No config provided.');
  }

  if (!config.apiToken) {
    throwError('No apiToken provided in config');
  }

  if (!config.apiUrl) {
    throwError('No apiUrl provided in config');
  }
};

// export const generateUUID = () =>
//   randomUUID({ disableEntropyCache: true }).replace(/[\W_]+/g, '');

// export const logger = (message: object, verbose?: boolean) =>
//   verbose &&
//   console.log(
//     JSON.stringify({ timestamp: new Date().toISOString(), message }, null, 2),
//   );
