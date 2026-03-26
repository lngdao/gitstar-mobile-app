import React, { useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from 'react-native-reanimated';
import { Text } from '../Text';
import { ToastItemDetailed } from './ToastItemDetailed';
import type { ToastItem as ToastItemType } from './Toast.type';

interface ToastItemProps {
  toast: ToastItemType;
  onHide: (id: string) => void;
}

export function ToastItem({ toast, onHide }: ToastItemProps) {
  // Use detailed variant if specified or if subtitle exists
  if (toast.variant === 'detailed' || toast.subtitle) {
    return <ToastItemDetailed toast={toast} onHide={onHide} />;
  }

  const hideToast = useCallback(() => {
    onHide(toast.id);
  }, [onHide, toast.id]);

  useEffect(() => {
    // Auto hide after duration
    const timer = setTimeout(() => {
      hideToast();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, hideToast]);

  return (
    <Animated.View
      style={styles.container}
      entering={FadeInDown.duration(250)}
      exiting={FadeOutUp.duration(200)}
      layout={Layout.duration(200)}
    >
      <Text variant="body" size="sm" className="text-center text-[#FAFAFA]">
        {toast.message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#272727',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 8,
  },
});
