import qs from 'qs';
import { NextUmbracoConfig } from '../types';

export const ApiFactory = {
  createRequestOptions: (config: NextUmbracoConfig) => ({
    headers: {
      ...config.headers,
      Authorization: `Bearer ${config.apiToken}`,
    },
  }),

  createQueryString: (queryObject?: Record<string, any>) =>
    queryObject
      ? qs.stringify(queryObject, {
          encodeValuesOnly: true,
        })
      : null,

  createFullPath: (path: string, query?: string | null) =>
    path.startsWith('/') ? path : `/${path}` + query ? `?${query}` : '',

  createUrl: (baseUrl: string, path: string) =>
    baseUrl.endsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`,
};
