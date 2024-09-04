interface StackedViewKept {
  keep: boolean,
  child?: StackedView | undefined,
}

interface StackedViewFull {
  component: string,
  props: any,
  child?: StackedView | undefined,
}

export type StackedView = StackedViewFull | StackedViewKept;
