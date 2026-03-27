import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from '@/shared/components';
import R from '@/resources';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const BRAND_COLOR = '#B6573A';
const SPLASH_DURATION = 1800;

interface SplashOverlayProps {
  onFinish: () => void;
}

export const SplashOverlay = ({ onFinish }: SplashOverlayProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });

    const timer = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 400 }, () => {
        runOnJS(onFinish)();
      });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [containerOpacity, onFinish, opacity, scale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={logoStyle}>
        <Image
          source={R.images.logo}
          width={120}
          height={120}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
