import deepmerge from 'deepmerge';
import { logger, throwError, validateConfig } from '../utils';
import { NextUmbracoConfig } from '../types';
import { ApiFactory } from '../factories/apiFactory';

export class HttpClient {
  private __config: NextUmbracoConfig;

  private constructor(config: NextUmbracoConfig) {
    this.__config = config;
  }

  static create(config: NextUmbracoConfig) {
    validateConfig(config);

    return new HttpClient(config);
  }

  async get(path: string, extraOptions: RequestInit = {}) {
    const url = ApiFactory.createUrl(this.__config.apiUrl, path);
    const options: RequestInit = deepmerge(
      ApiFactory.createRequestOptions(this.__config),
      extraOptions,
    );
    const startTime = Date.now();
    let response: any;

    try {
      const resp = await fetch(url, options);

      if (resp.status !== 200) {
        throw new Error('Failed to fetch');
      }

      const json: any = await resp.json();
      response = json.data;
      const responseTime = Date.now() - startTime;

      logger(
        { fetchUrl: url, responseTime: `${responseTime} ms` },
        this.__config.verbose,
      );
    } catch (err: any) {
      throwError('Unable to get data from url.', url, err);
    }

    return response;
  }
}
