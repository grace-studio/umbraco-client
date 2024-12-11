import type { components, paths } from '../_dev/types';
import { UmbracoClient } from '../src';

type Models = components['schemas'];

(async () => {
  const apiClient = UmbracoClient.create<paths>({
    apiToken: 'asdf',
    apiUrl: 'https://ekstrands.euwest01.umbraco.io',
    // apiUrl: 'https://localhost:44317',
  });

  const api = {
    getContent: () =>
      apiClient
        .get('/umbraco/delivery/api/v2/content', {
          params: {
            query: { fields: 'properties[umbracoNaviHide,isSecondaryLink]' },
          },
        })
        .then(UmbracoClient.format.content),
    getContentItem: (path: string) =>
      apiClient
        .get('/umbraco/delivery/api/v2/content/item/{path}', {
          params: {
            path: {
              path,
            },
          },
        })
        .then(UmbracoClient.format.contentItem),
    getContentItemById: (id: string) =>
      apiClient
        .get('/umbraco/delivery/api/v2/content/item/{id}', {
          params: {
            path: {
              id,
            },
            header: {
              Preview: true,
            },
          },
        })
        .then(UmbracoClient.format.contentItem),
    getMenu: (basePath: string, headers?: Record<string, any>) =>
      apiClient.getMenu({
        basePath,
        excludeHidden: true,
        mappingFunctions: {
          hidden: ({ umbracoNaviHide }) => Boolean(umbracoNaviHide),
        },
        properties: {
          menuBlock: ({ menuBlock }) => menuBlock,
          type: ({ isSecondaryLink }) =>
            isSecondaryLink === true ? 'secondary' : 'primary',
        },
        extraQueryParams: {
          fields: 'properties[umbracoNaviHide,isSecondaryLink,menuBlock]',
          take: '9999',
        },
        headers,
      }),
    getPaths: (basePath: string) =>
      apiClient.getPaths({
        basePath,
        excludeHidden: false,
        extraQueryParams: {
          fields: 'properties[umbracoNaviHide,isSecondaryLink]',
        },
        mappingFunctions: {
          hidden: ({ umbracoNaviHide }) => Boolean(umbracoNaviHide),
        },
      }),
  };

  const menu = await api.getMenu('/sv', {
    revalidate: '123',
  });
  // const paths = await api.getPaths('/sv');

  // console.log(menu, menu.length);
  console.log(JSON.stringify(menu[0], null, 2), menu.length);
  // console.log(JSON.stringify(paths, null, 2), paths.length);
})();
