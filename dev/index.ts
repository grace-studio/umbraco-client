import type { components, paths } from '../_dev/types';
import { UmbracoClient } from '../src';

type Models = components['schemas'];

(async () => {
  const apiClient = UmbracoClient.create<paths>({
    apiToken: 'asdf',
    apiUrl: 'https://localhost:44317',
  });

  const api = {
    getContent: () =>
      apiClient
        .get('/umbraco/delivery/api/v2/content')
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
    getMenu: (basePath: string) =>
      apiClient.getMenu({
        basePath,
        excludeHidden: true,
        mappingFunctions: {
          hidden: ({ umbracoNaviHide }) => Boolean(umbracoNaviHide),
          type: ({ isSecondaryLink }) =>
            isSecondaryLink === true ? 'secondary' : 'primary',
        },
      }),
    getPaths: (basePath: string) =>
      apiClient.getPaths({
        basePath,
        excludeHidden: true,
        mappingFunctions: {
          hidden: ({ umbracoNaviHide }) => Boolean(umbracoNaviHide),
        },
      }),
  };

  const menu = await api.getMenu('/sv');
  const paths = await api.getPaths('/sv');

  console.log(JSON.stringify(menu, null, 2));
  console.log(JSON.stringify(paths, null, 2));
})();
