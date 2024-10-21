export enum ToastKind {
  SUCCESS = 'success',
  DANGER = 'danger',
  INFO = 'info',
  WARNING = 'warning',
}

export interface Toast {
  id: string,
  description: string,
  duration: number,
  kind: ToastKind,
}

export type ToastRegistry = Toast[];
