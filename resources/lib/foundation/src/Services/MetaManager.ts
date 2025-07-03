import type { Meta } from '../Types/State.ts';

export function updateHead(meta?: Meta[]) {
  if (!meta) {
    return meta;
  }

  document.head.querySelectorAll('[data-fdn]').forEach((element) => element.remove());

  meta.forEach((tag) => {
    let element: HTMLElement;

    switch (tag.type) {
      case 'title':
        element = document.createElement('title');
        element.innerHTML = tag.content;
        break;

      case 'meta':
        element = document.createElement('meta');
        element.setAttribute('name', tag.name);
        element.setAttribute('content', tag.content);
        break;

      case 'link':
        element = document.createElement('link');
        element.setAttribute('rel', tag.rel);
        element.setAttribute('href', tag.href);
        break;

      case 'snippet':
        element = document.createElement('script');
        element.setAttribute('type', 'application/ld+json');
        element.innerHTML = tag.content;
        break;
    }

    element.setAttribute('data-fdn', '');

    document.head.append(element);
  });

  return meta;
}
