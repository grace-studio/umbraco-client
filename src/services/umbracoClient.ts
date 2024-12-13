import { throwError, validateConfig } from '../utils';
import type { FilterV2Keys, PathConfig, UmbracoClientConfig } from '../types';
import createClient, { Client, ClientMethod } from 'openapi-fetch';
import {
  BaseItem,
  BasePage,
  ContentResponse,
  MenuItem,
  MenuPageItem,
  PathItem,
} from '../types/client';
import {
  buildMenuHierarchy,
  flattenMenuHierarchy,
} from '../utils/buildMenuHierarchy';
import { objectMap } from '../utils/objectMap';

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

  private __getPathDescendants(
    path: string,
    extraQueryParams: Record<string, string> = {},
    headers?: Record<string, any>,
  ) {
    return this.get(
      '/umbraco/delivery/api/v2/content' as any,
      {
        params: {
          query: {
            fetch: `descendants:${path}`,
            sort: 'sortOrder:asc',
            ...extraQueryParams,
          },
          header: headers,
        },
        // headers,
      } as any,
    ).then(UmbracoClient.format.content);
  }

  public async getMenu(config: PathConfig = { basePath: 'en' }) {
    const conf: PathConfig = {
      properties: {},
      ...config,
      mappingFunctions: {
        hidden: () => false,
        ...config.mappingFunctions,
      },
    };

    const menuItems = await this.__getPathDescendants(
      conf.basePath,
      conf.extraQueryParams,
      conf.headers,
    ).then(this.__format.menuItems(conf));

    return conf.excludeHidden
      ? this.__filter.hiddenMenuItems(buildMenuHierarchy(menuItems))
      : buildMenuHierarchy(menuItems);
  }

  public async getPaths(config: PathConfig = { basePath: 'en' }) {
    const menu = await this.getMenu(config);

    return this.__format.pathItems(flattenMenuHierarchy(menu));
  }

  private get __format() {
    return {
      menuItems:
        (config: PathConfig) =>
        (items: MenuPageItem[]): MenuItem[] =>
          items.map((item) => ({
            id: item.id,
            name: item.name,
            path: item.route.path,
            parent: config.basePath,
            hidden: config.mappingFunctions!.hidden!(item.properties),
            children: [],
            properties: config.properties
              ? objectMap(config.properties, item.properties)
              : undefined,
          })),
      pathItems: (items: MenuItem[]): PathItem[] =>
        items.map((item) => ({
          id: item.id,
          name: item.name,
          hidden: item.hidden,
          parent: item.parent,
          path: item.path,
          properties: item.properties,
        })),
    };
  }

  private get __filter() {
    return {
      hiddenMenuItems: (items: MenuItem[]): MenuItem[] =>
        items
          .filter((item) => !item.hidden)
          .map((item) => ({
            ...item,
            children: this.__filter.hiddenMenuItems(item.children),
          })),
    };
  }

  static get format() {
    return {
      content: <D extends BasePage, E>({
        data,
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
        response,
      }: ContentResponse<D, E>) => {
        if (data) {
          return data;
        }

        throwError(
          `Fetching content item failed, status ${response?.status}, url ${response?.url}`,
        );
      },
    };
  }
}
