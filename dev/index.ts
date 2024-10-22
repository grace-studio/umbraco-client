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
        .then(UmbracoClient.format.content)
        .then(UmbracoClient.filter.hasCultures),
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
    getPaths: () =>
      apiClient
        .get('/umbraco/delivery/api/v2/content', {
          params: {
            query: { fields: 'properties[none]' },
          },
        })
        .then(UmbracoClient.format.paths),
  };

  const c = await api.getContent();
  const p = await api.getPaths();
  const i = await api.getContentItem('/faq/');
  console.log(p);
  console.log(i);
})();
