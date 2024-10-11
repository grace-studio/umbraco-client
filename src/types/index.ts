export type NextUmbracoConfig = {
  apiUrl: string;
  apiToken: string;
  headers?: Record<string, string>;
  verbose?: boolean;
};

type FetchOptions = {
  extraFetchOptions?: RequestInit;
};
