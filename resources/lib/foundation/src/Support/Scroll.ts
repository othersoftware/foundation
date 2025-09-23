export function findScrollParent(element: HTMLElement | HTMLElement[] | undefined | null) {
  if (!element) {
    return undefined;
  }

  if (Array.isArray(element)) {
    if (element.length === 0) {
      return undefined;
    }

    element = element[0];
  }

  let parent: HTMLElement | null | undefined = element;

  while (parent) {
    const { overflow } = window.getComputedStyle(parent);

    if (overflow.split(' ').some((o) => o === 'auto' || o === 'scroll')) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return document.documentElement;
}
