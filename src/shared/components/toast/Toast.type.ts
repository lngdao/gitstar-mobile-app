export type ToastType = 'success' | 'error' | 'info' | 'default';
export type ToastVariant = 'simple' | 'detailed';

export interface ToastAction {
  label: string;
  onPress: () => void;
  /** Show external link icon (arrow_right_up). Default: false */
  showExternalIcon?: boolean;
}

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  variant?: ToastVariant;
  subtitle?: string;
  showCloseButton?: boolean;
  showProgressBar?: boolean;
  action?: ToastAction;
}

export interface ToastItem extends Required<Omit<ToastConfig, 'subtitle' | 'showCloseButton' | 'showProgressBar' | 'action'>> {
  id: string;
  timestamp: number;
  subtitle?: string;
  showCloseButton?: boolean;
  showProgressBar?: boolean;
  action?: ToastAction;
}

export interface ToastMethods {
  show: (config: ToastConfig | string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  hide: (id: string) => void;
  hideAll: () => void;
}
