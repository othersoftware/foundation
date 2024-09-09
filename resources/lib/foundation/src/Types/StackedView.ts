interface StackedViewKept {
  keep: boolean,
  child?: StackedView | undefined,
}

export interface StackedViewResolved {
  component: string,
  props: any,
  parent?: StackedViewResolved | undefined,
  child?: StackedViewResolved | undefined,
  location?: string | undefined,
  query: Record<string, any>,
}

export type StackedView = StackedViewResolved | StackedViewKept;
