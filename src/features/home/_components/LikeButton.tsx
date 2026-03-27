import { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';

const LIKED_COLOR = '#E8445A';
const IDLE_COLOR = '#A1A1A1';

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onPress?: () => void;
  disabled?: boolean;
}

export function LikeButton({ liked, count, onPress, disabled }: LikeButtonProps) {
  const scale = useSharedValue(1);
  const rippleScale = useSharedValue(0.5);
  const rippleOpacity = useSharedValue(0);
  const prevLikedRef = useRef(liked);

  useEffect(() => {
    const wasLiked = prevLikedRef.current;
    prevLikedRef.current = liked;

    if (liked && !wasLiked) {
      // Pop: compress → overshoot → settle
      cancelAnimation(scale);
      scale.value = withSequence(
        withSpring(0.68, { damping: 7,  stiffness: 480 }),
        withSpring(1.36, { damping: 5,  stiffness: 340 }),
        withSpring(1.0,  { damping: 14, stiffness: 260 }),
      );

      // Ripple burst
      cancelAnimation(rippleScale);
      cancelAnimation(rippleOpacity);
      rippleScale.value = 0.5;
      rippleOpacity.value = 0.38;
      rippleScale.value = withTiming(2.8, { duration: 580, easing: Easing.out(Easing.cubic) });
      rippleOpacity.value = withTiming(0,   { duration: 580, easing: Easing.out(Easing.cubic) });
    }
  }, [liked, rippleOpacity, rippleScale, scale]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.80, { damping: 12, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 260 });
      }}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={liked ? 'Unlike' : 'Like'}
      accessibilityState={{ selected: liked }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
    >
      {/* Icon + ripple container */}
      <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={[
            rippleStyle,
            {
              position: 'absolute',
              width: 20, height: 20,
              borderRadius: 10,
              backgroundColor: LIKED_COLOR,
            },
          ]}
        />
        <Animated.View style={heartStyle}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={15}
            color={liked ? LIKED_COLOR : IDLE_COLOR}
          />
        </Animated.View>
      </View>

      <Text variant="body" size="xs" style={{ color: liked ? LIKED_COLOR : IDLE_COLOR }}>
        {formatCount(count)}
      </Text>
    </Pressable>
  );
}
