export type HeadMeta = {
  type: 'title',
  content: string;
} | {
  type: 'meta',
  name: string;
  content: string;
} | {
  type: 'link',
  rel: string;
  href: string;
} | {
  type: 'snippet',
  content: string;
};
