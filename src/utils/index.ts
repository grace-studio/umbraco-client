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
