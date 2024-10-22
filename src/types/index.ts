export type FilterV2Keys<T> = {
  [K in keyof T as K extends `${string}v2${string}` ? K : never]: T[K];
};

export type UmbracoClientConfig = {
  apiUrl: string;
  apiToken: string;
  // headers?: Record<string, string>;
  // verbose?: boolean;
};
