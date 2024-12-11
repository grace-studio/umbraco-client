export type FilterV2Keys<T> = {
  [K in keyof T as K extends `${string}v2${string}` ? K : never]: T[K];
};

export type UmbracoClientConfig = {
  apiUrl: string;
  apiToken: string;
};

export type PathConfig = {
  basePath: string;
  excludeHidden?: boolean;
  mappingFunctions?: {
    hidden?: (rawProperties: Record<string, any>) => boolean;
  };
  properties?: Record<string, (rawProperties: Record<string, any>) => any>;
  extraQueryParams?: Record<string, string>;
  headers?: Record<string, any>;
};
