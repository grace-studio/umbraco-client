export type Culture = {
  path: string;
};

export type BaseItem = {
  cultures: Record<string, Culture>;
};

export type MenuPageItem = BaseItem & {
  contentType: string;
  name: string;
  createDate: string;
  updateDate: string;
  route: {
    path: string;
    startItem: {
      id: string;
      path: string;
    };
  };
  id: string;
  properties: Record<string, any>;
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

export type PathItem = {
  id: string;
  name: string;
  hidden: boolean;
  path: string;
  parent: string;
  type: string;
};

export type MenuItem = PathItem & {
  children: MenuItem[];
};
