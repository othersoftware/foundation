export type Options = {
  target: Record<string, string | null | undefined> | string;
  components: Record<string, string | null | undefined> | string[] | string;
  views: Record<string, string | null | undefined> | string[] | string;
  namespace: string | null | false | undefined;
}
