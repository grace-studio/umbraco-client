import { throwError, validateConfig } from '../utils';
import type { FilterV2Keys, UmbracoClientConfig } from '../types';
import createClient, { Client, ClientMethod } from 'openapi-fetch';
import { BaseItem, BasePage, ContentResponse, Path } from '../types/client';

const internals = {
  cultureFilter: (item: { cultures: Record<string, object> }) =>
    Object.keys(item.cultures).length > 0,
};

export class UmbracoClient<T extends {}> {
  private __client: Client<T>;
  public get: ClientMethod<T, 'get', `${string}/${string}`>;

  private constructor(config: UmbracoClientConfig) {
    this.__client = createClient<T>({
      baseUrl: config.apiUrl,
      // headers: { Authorization: `Bearer ${config.apiToken}` },
    });
    this.get = this.__client.GET;
  }

  static create<T extends {}>(config: UmbracoClientConfig) {
    validateConfig(config);

    return new UmbracoClient<FilterV2Keys<T>>(config);
  }

  static get format() {
    return {
      content: <D extends BasePage, E>({
        data,
        error,
        response,
      }: ContentResponse<D, E>) => {
        if (data?.items) {
          return (data.items ?? []) as D['items'];
        }

        throwError(
          `Fetching content failed, status ${response?.status}, url ${response?.url}`,
        );
      },
      contentItem: <D extends BaseItem, E>({
        data,
        error,
        response,
      }: ContentResponse<D, E>) => {
        if (data) {
          return data;
        }

        throwError(
          `Fetching content item failed, status ${response?.status}, url ${response?.url}`,
        );
      },
      paths: <D extends BasePage, E>(
        content: ContentResponse<D, E>,
      ): Path[] | undefined =>
        UmbracoClient.format
          .content(content)
          ?.filter(internals.cultureFilter)
          .flatMap((item) =>
            Object.entries(item.cultures).map(([locale, culture]) => ({
              locale,
              path: culture.path,
            })),
          ),
    };
  }

  static get filter() {
    return {
      hasCultures: <D extends { cultures: Record<string, object> }>(
        items: D[] = [],
      ) => items.filter(internals.cultureFilter),
    };
  }
}
