export const ToastKind = {
  SUCCESS: 'success',
  DANGER: 'danger',
  INFO: 'info',
  WARNING: 'warning',
} as const;

export interface Toast {
  id: string,
  description: string,
  duration: number,
  kind: typeof ToastKind[keyof typeof ToastKind],
}

export type ToastRegistry = Toast[];
