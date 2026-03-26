import { createRef } from 'react';
import type { ToastMethods, ToastConfig } from './Toast.type';

export const toastRef = createRef<ToastMethods>();

export const Toast = {
  show: (config: ToastConfig | string) => {
    toastRef.current?.show(config);
  },

  success: (message: string, duration?: number) => {
    toastRef.current?.success(message, duration);
  },

  error: (message: string, duration?: number) => {
    toastRef.current?.error(message, duration);
  },

  info: (message: string, duration?: number) => {
    toastRef.current?.info(message, duration);
  },

  hide: (id: string) => {
    toastRef.current?.hide(id);
  },

  hideAll: () => {
    toastRef.current?.hideAll();
  },

  // Detailed variant helpers
  showDetailed: (config: Omit<ToastConfig, 'variant'>) => {
    toastRef.current?.show({ ...config, variant: 'detailed' });
  },

  successDetailed: (message: string, subtitle?: string, duration?: number) => {
    toastRef.current?.show({
      message,
      subtitle,
      type: 'success',
      variant: 'detailed',
      position: 'top',
      duration: duration ?? 3000,
      showCloseButton: true,
      showProgressBar: true,
    });
  },

  errorDetailed: (message: string, subtitle?: string, duration?: number) => {
    toastRef.current?.show({
      message,
      subtitle,
      type: 'error',
      variant: 'detailed',
      position: 'top',
      duration: duration ?? 3000,
      showCloseButton: true,
      showProgressBar: true,
    });
  },

  infoDetailed: (message: string, subtitle?: string, duration?: number) => {
    toastRef.current?.show({
      message,
      subtitle,
      type: 'info',
      variant: 'detailed',
      position: 'top',
      duration: duration ?? 3000,
      showCloseButton: true,
      showProgressBar: true,
    });
  },
};
