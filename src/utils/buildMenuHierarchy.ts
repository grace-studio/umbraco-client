import { MenuItem } from '../types/client';

const findParentPath = (path: string): string | null => {
  const segments = path.split('/').filter((segment) => segment !== '');

  if (segments.length <= 1) {
    return null;
  }

  segments.pop();

  return `/${segments.join('/')}/`;
};

export const buildMenuHierarchy = (items: MenuItem[]) => {
  const itemMap = new Map<string, MenuItem>(
    items.map((item) => [item.path, item]),
  );

  const rootItems: MenuItem[] = [];

  items.forEach((item) => {
    const parentPath = findParentPath(item.path);

    if (parentPath && itemMap.has(parentPath)) {
      const parent = itemMap.get(parentPath);
      const child = itemMap.get(item.path);
      if (parent && child) {
        child.parent = parentPath;
        parent.children.push(child);
      }
    } else {
      rootItems.push(itemMap.get(item.path)!);
    }
  });

  return rootItems;
};

export const flattenMenuHierarchy = (items: MenuItem[]): MenuItem[] =>
  items.flatMap((item) => [
    { ...item, children: [] },
    ...flattenMenuHierarchy(item.children),
  ]);
