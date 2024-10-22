export type Culture = {
  path: string;
};

export type BaseItem = {
  cultures: Record<string, Culture>;
};

export type BasePage = {
  total: number;
  items: BaseItem[];
};

export type ContentResponse<D, E> = {
  data?: D;
  error?: E;
  response?: Response;
};

export type Path = Culture & {
  locale: string;
};
