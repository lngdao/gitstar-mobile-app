import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToastItem } from './ToastItem';
import type { ToastItem as ToastItemType, ToastConfig, ToastMethods } from './Toast.type';

export interface ToasterProps {
  position?: 'top' | 'bottom' | 'center';
  offset?: number;
}

export const Toaster = forwardRef<ToastMethods, ToasterProps>(({ position = 'center', offset = 0 }, ref) => {
  const [toasts, setToasts] = useState<ToastItemType[]>([]);
  const insets = useSafeAreaInsets();

  const show = useCallback((config: ToastConfig | string) => {
    const toastConfig: ToastConfig =
      typeof config === 'string' ? { message: config } : config;

    const newToast: ToastItemType = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message: toastConfig.message,
      type: toastConfig.type || 'default',
      duration: toastConfig.duration || 3000,
      position: toastConfig.position || position,
      variant: toastConfig.variant || 'simple',
      timestamp: Date.now(),
      subtitle: toastConfig.subtitle,
      showCloseButton: toastConfig.showCloseButton ?? (toastConfig.variant === 'detailed'),
      showProgressBar: toastConfig.showProgressBar ?? (toastConfig.variant === 'detailed'),
      action: toastConfig.action,
    };

    setToasts((prev) => [...prev, newToast]);
  }, [position]);

  const hide = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const hideAll = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    show({ message, type: 'success', duration });
  }, [show]);

  const error = useCallback((message: string, duration?: number) => {
    show({ message, type: 'error', duration });
  }, [show]);

  const info = useCallback((message: string, duration?: number) => {
    show({ message, type: 'info', duration });
  }, [show]);

  useImperativeHandle(ref, () => ({
    show,
    success,
    error,
    info,
    hide,
    hideAll,
  }), [show, success, error, info, hide, hideAll]);

  if (toasts.length === 0) {
    return null;
  }

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const pos = toast.position;
    if (!acc[pos]) {
      acc[pos] = [];
    }
    acc[pos].push(toast);
    return acc;
  }, {} as Record<string, ToastItemType[]>);

  const getPositionStyle = (pos: 'top' | 'bottom' | 'center') => {
    switch (pos) {
      case 'top':
        return { top: insets.top + offset, paddingTop: 16 };
      case 'bottom':
        return { bottom: insets.bottom + offset, paddingBottom: 16 };
      case 'center':
        return {
          top: 0,
          bottom: 0,
          justifyContent: 'center' as const
        };
      default:
        return { top: insets.top + offset, paddingTop: 16 };
    }
  };

  return (
    <>
      {Object.entries(toastsByPosition).map(([pos, positionToasts]) => (
        <View
          key={pos}
          style={[styles.container, getPositionStyle(pos as 'top' | 'bottom' | 'center')]}
          pointerEvents="box-none"
        >
          {positionToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onHide={hide} />
          ))}
        </View>
      ))}
    </>
  );
});

Toaster.displayName = 'Toaster';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
});
