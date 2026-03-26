import React, { useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Pressable, Animated as RNAnimated, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { Box } from '../Box';
import { Text } from '../Text';
import type { ToastItem as ToastItemType } from './Toast.type';

interface ToastItemDetailedProps {
  toast: ToastItemType;
  onHide: (id: string) => void;
}

const SWIPE_THRESHOLD = 40;

export function ToastItemDetailed({ toast, onHide }: ToastItemDetailedProps) {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const swipeTranslate = useSharedValue(0);

  // Use standard Animated for progress
  const progressAnim = useRef(new RNAnimated.Value(0)).current;
  const progressAnimRef = useRef<RNAnimated.CompositeAnimation | null>(null);

  // Timing ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine swipe direction based on position
  const isVerticalSwipe = toast.position === 'top' || toast.position === 'bottom';

  const hideToast = useCallback(() => {
    onHide(toast.id);
  }, [onHide, toast.id]);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressAnimRef.current) {
      progressAnimRef.current.stop();
      progressAnimRef.current = null;
    }
  }, []);

  const animateOut = useCallback(() => {
    'worklet';
    runOnJS(clearAllTimers)();
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(-20, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(hideToast)();
      }
    });
  }, [opacity, translateY, hideToast, clearAllTimers]);

  const animateOutSwipe = useCallback(() => {
    'worklet';
    runOnJS(clearAllTimers)();
    const targetValue = toast.position === 'top' ? -300 :
                        toast.position === 'bottom' ? 300 :
                        swipeTranslate.value > 0 ? 400 : -400;

    opacity.value = withTiming(0, { duration: 150 });
    swipeTranslate.value = withTiming(targetValue, { duration: 150 }, (finished) => {
      if (finished) {
        runOnJS(hideToast)();
      }
    });
  }, [opacity, swipeTranslate, hideToast, clearAllTimers, toast.position]);

  // Swipe gesture
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      if (isVerticalSwipe) {
        const translation = event.translationY;
        if (toast.position === 'top') {
          swipeTranslate.value = Math.min(0, translation);
        } else {
          swipeTranslate.value = Math.max(0, translation);
        }
      } else {
        swipeTranslate.value = event.translationX;
      }
    })
    .onEnd((event) => {
      'worklet';
      const translation = isVerticalSwipe ? event.translationY : event.translationX;
      const velocity = isVerticalSwipe ? event.velocityY : event.velocityX;

      let shouldDismiss = false;
      if (toast.position === 'top') {
        shouldDismiss = translation < -SWIPE_THRESHOLD || velocity < -500;
      } else if (toast.position === 'bottom') {
        shouldDismiss = translation > SWIPE_THRESHOLD || velocity > 500;
      } else {
        shouldDismiss = Math.abs(translation) > SWIPE_THRESHOLD || Math.abs(velocity) > 500;
      }

      if (shouldDismiss) {
        animateOutSwipe();
      } else {
        swipeTranslate.value = withTiming(0, { duration: 200 });
      }
    });

  useEffect(() => {
    // Reset state
    progressAnim.setValue(0);

    // Progress bar animation
    if (toast.showProgressBar) {
      progressAnimRef.current = RNAnimated.timing(progressAnim, {
        toValue: 1,
        duration: toast.duration,
        useNativeDriver: false,
      });
      progressAnimRef.current.start();
    }

    // Auto hide timer
    timerRef.current = setTimeout(() => {
      animateOut();
    }, toast.duration);

    return () => clearAllTimers();
  }, [toast.id, toast.duration, toast.showProgressBar, progressAnim, animateOut, clearAllTimers]);

  const handleClose = useCallback(() => {
    animateOut();
  }, [animateOut]);

  const handleActionPress = useCallback(() => {
    toast.action?.onPress();
    animateOut();
  }, [toast.action, animateOut]);

  const getIconColor = () => {
    switch (toast.type) {
      case 'success':
        return '#1EC977';
      case 'error':
        return '#FF4F4F';
      case 'info':
        return '#3B82F6';
      default:
        return '#FAFAFA';
    }
  };

  const getProgressBarColor = () => {
    switch (toast.type) {
      case 'success':
        return '#1EC977';
      case 'error':
        return '#FF4F4F';
      case 'info':
        return '#3B82F6';
      default:
        return '#FAFAFA';
    }
  };

  const renderIcon = () => {
    const iconColor = getIconColor();

    // Render a simple colored circle indicator instead of source-specific SVG icons
    switch (toast.type) {
      case 'success':
      case 'error':
      case 'info':
        return (
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: iconColor,
              opacity: 0.2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: iconColor,
              }}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const swipeValue = swipeTranslate.value;
    const swipeOpacity = interpolate(
      Math.abs(swipeValue),
      [0, SWIPE_THRESHOLD],
      [1, 0.6],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacity.value * swipeOpacity,
      transform: [
        { translateY: translateY.value + (isVerticalSwipe ? swipeValue : 0) },
        { translateX: isVerticalSwipe ? 0 : swipeValue },
      ],
    };
  });

  // Progress bar width using standard Animated interpolation
  const progressBarStyle = {
    width: progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.container, animatedContainerStyle]}
        entering={FadeInDown.duration(250)}
        layout={Layout.duration(200)}
      >
        {/* Leading Icon */}
        {renderIcon() && (
          <Box className="shrink-0">
            {renderIcon()}
          </Box>
        )}

        {/* Content */}
        <Box className="flex-1 gap-12">
          {/* Text Content */}
          <Box className="gap-6">
            {/* Title */}
            <Text variant="label" size="sm" color="primary">
              {toast.message}
            </Text>

            {/* Subtitle */}
            {toast.subtitle && (
              <Text variant="body" size="xs" color="secondary">
                {toast.subtitle}
              </Text>
            )}
          </Box>

          {/* Action Button */}
          {toast.action && (
            <Box className="pb-2 mt-2">
              <Pressable
                onPress={handleActionPress}
                style={styles.actionButton}
              >
                <Text variant="label" size="xs" color="primary" className='font-inter-medium'>
                  {toast.action.label}
                </Text>
              </Pressable>
            </Box>
          )}
        </Box>

        {/* Close Button */}
        {toast.showCloseButton && (
          <Pressable
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={8}
          >
            <Text variant="body" size="xs" color="primary">
              ✕
            </Text>
          </Pressable>
        )}

        {/* Progress Bar */}
        {toast.showProgressBar && (
          <RNAnimated.View
            style={[
              styles.progressBar,
              { backgroundColor: getProgressBarColor() },
              progressBarStyle,
            ]}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1C',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  closeButton: {
    padding: 2,
    marginTop: -2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
  },
});
