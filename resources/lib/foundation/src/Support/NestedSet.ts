export type NestedSetItem = {
  id: number;
  left: number;
  right: number;
  parentId: number | null;
  title: string;
}

export type NestedSet<T extends NestedSetItem = any> = T[];

export function nestedSetRoot<T extends NestedSetItem = any>(data: NestedSet<T>) {
  return data.filter((node) => node.parentId === null);
}

export function nestedSetChildren<T extends NestedSetItem = any>(data: NestedSet<T>, item: T) {
  return data.filter((node) => (node.left > item.left && node.right < item.right && node.parentId === item.id));
}

export function nestedSetAncestors<T extends NestedSetItem = any>(data: NestedSet<T>, item: T) {
  return data.filter((node) => (node.left < item.left && node.right > item.right));
}

export function nestedSetDescendants<T extends NestedSetItem = any>(data: NestedSet<T>, item: T) {
  return data.filter((node) => (node.left > item.left && node.right < item.right));
}
