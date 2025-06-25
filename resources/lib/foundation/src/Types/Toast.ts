export const ToastKind = {
  SUCCESS: 'success',
  DANGER: 'danger',
  INFO: 'info',
  WARNING: 'warning',
};

export interface Toast {
  id: string,
  description: string,
  duration: number,
  kind: typeof ToastKind,
}

export type ToastRegistry = Toast[];
