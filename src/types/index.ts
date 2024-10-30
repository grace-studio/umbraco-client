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
    type?: (properties: Record<string, any>) => string;
    hidden?: (properties: Record<string, any>) => boolean;
  };
};
