import { HttpClient } from '../data/httpClient';
import { validateConfig } from '../utils';
import type { NextUmbracoConfig } from '../types';
import { ApiFactory } from '../factories/apiFactory';

export class NextUmbraco {
  private __config: NextUmbracoConfig;
  private __httpClient: HttpClient;

  private constructor(config: NextUmbracoConfig) {
    this.__config = config;
    this.__httpClient = HttpClient.create(config);
  }

  static create(config: NextUmbracoConfig) {
    validateConfig(config);

    return new NextUmbraco(config);
  }

  private async __fetchFromApi<T, M>(
    path: string,
    queryObject: Record<string, any>,
    extraOptions?: RequestInit,
  ) {
    const queryString = ApiFactory.createQueryString(queryObject);
    const fullPath = ApiFactory.createFullPath(path, queryString);

    const response = await this.__httpClient.get(fullPath, extraOptions);

    // return {
    //   data: [DataFactory.flattenStrapiV4Response<T>(response)].flat(),
    //   meta: response.meta as M,
    // };
  }

  get get() {
    const content = () => {};

    return {
      content,
    };
  }
}
