export type NestedSetItem = {
  id: number;
  left: number;
  right: number;
  parent: number | null;
  label: string | null;
}

export type NestedSet<T extends NestedSetItem = any> = T[];

export function nestedSetRoot<T extends NestedSetItem = any>(data: NestedSet<T>) {
  return data.filter((node) => node.parent === null);
}

export function nestedSetChildren<T extends NestedSetItem = any>(data: NestedSet<T>, item: T) {
  return data.filter((node) => (node.left > item.left && node.right < item.right && node.parent === item.id));
}

export function nestedSetAncestors<T extends NestedSetItem = any>(data: NestedSet<T>, item: T) {
  return data.filter((node) => (node.left < item.left && node.right > item.right));
}

export function nestedSetDescendants<T extends NestedSetItem = any>(data: NestedSet<T>, item: T) {
  return data.filter((node) => (node.left > item.left && node.right < item.right));
}
