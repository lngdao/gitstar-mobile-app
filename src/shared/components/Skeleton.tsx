import React, { useEffect } from 'react';
import { ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Box } from './Box';

export interface SkeletonProps {
  /**
   * Width of the skeleton
   * Can be a number or string (e.g., '100%', '50%')
   */
  width?: number | string;

  /**
   * Height of the skeleton
   */
  height?: number;

  /**
   * Border radius
   */
  borderRadius?: number;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Animation duration in milliseconds
   * @default 2000
   */
  duration?: number;

  /**
   * Whether to show shimmer animation
   * @default true
   */
  animated?: boolean;

  /**
   * Custom gradient colors [start, end]
   * @default ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] for dark mode
   */
  colors?: [string, string];
}

/**
 * Skeleton Loader Component with Gradient Shimmer Effect
 *
 * Matches Figma design with gradient from rgba(255,255,255,0.1) to rgba(255,255,255,0.05)
 * Features a sweeping shimmer animation from left to right
 *
 * @example
 * ```tsx
 * <Skeleton width={100} height={20} borderRadius={4} />
 * <Skeleton width="100%" height={40} borderRadius={8} />
 * <Skeleton width={200} height={44} borderRadius={8} animated={false} />
 * ```
 */
export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  className = '',
  duration = 2000,
  animated = true,
  colors = ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
}: SkeletonProps) {
  const shimmerTranslate = useSharedValue(-1);
  const isAnimating = useSharedValue(false);

  useEffect(() => {
    if (animated && !isAnimating.value) {
      isAnimating.value = true;
      shimmerTranslate.value = -1;
      shimmerTranslate.value = withRepeat(
        withTiming(1, { duration }),
        -1,
        false,
      );
    } else if (!animated && isAnimating.value) {
      isAnimating.value = false;
      shimmerTranslate.value = -1;
    }
  }, [animated, duration, shimmerTranslate, isAnimating]);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerTranslate.value,
      [-1, 1],
      [-200, 600],
    );

    return {
      transform: [{ translateX }],
      opacity: animated ? 1 : 0,
    };
  });

  const containerStyle: ViewStyle = {
    height,
    borderRadius,
    width: width as DimensionValue,
    overflow: 'hidden',
  };

  return (
    <Animated.View className={className} style={containerStyle}>
      {/* Base gradient background (from Figma design) */}
      <LinearGradient
        colors={colors} // ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Shimmer overlay */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 150,
            height: '100%',
          },
          shimmerStyle,
        ]}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.08)',
            'rgba(255,255,255,0.15)',
            'rgba(255,255,255,0.08)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Animated.View>
    </Animated.View>
  );
}

/**
 * Skeleton Circle Component
 *
 * @example
 * ```tsx
 * <SkeletonCircle size={28} />
 * <SkeletonCircle size={60} animated={false} />
 * ```
 */
export interface SkeletonCircleProps
  extends Omit<SkeletonProps, 'borderRadius' | 'width' | 'height'> {
  /**
   * Size of the circle (width and height)
   */
  size: number;
}

export function SkeletonCircle({ size, ...props }: SkeletonCircleProps) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} {...props} />;
}

/**
 * Skeleton Text Component - Multiple lines
 *
 * @example
 * ```tsx
 * // Single line
 * <SkeletonText />
 *
 * // Multiple lines with same width
 * <SkeletonText lines={3} />
 *
 * // Multiple lines with different widths
 * <SkeletonText lines={2} widths={['100%', '60%']} />
 *
 * // Custom line height and gap
 * <SkeletonText lines={2} lineHeight={20} gap={4} />
 * ```
 */
export interface SkeletonTextProps extends Omit<SkeletonProps, 'height'> {
  /**
   * Number of lines
   * @default 1
   */
  lines?: number;

  /**
   * Height of each line
   * @default 16
   */
  lineHeight?: number;

  /**
   * Gap between lines
   * @default 4
   */
  gap?: number;

  /**
   * Width of each line (can be array for different widths per line)
   * @example ['100%', '80%', '60%']
   */
  widths?: (number | string)[];
}

export function SkeletonText({
  lines = 1,
  lineHeight = 16,
  gap = 4,
  widths,
  ...props
}: SkeletonTextProps) {
  const lineWidths = widths || Array(lines).fill('100%');

  if (lines === 1) {
    return <Skeleton width={lineWidths[0] || '100%'} height={lineHeight} {...props} />;
  }

  return (
    <Box className="flex-col" style={{ gap }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={`skeleton-text-${index}`}
          width={lineWidths[index] || '100%'}
          height={lineHeight}
          {...props}
        />
      ))}
    </Box>
  );
}

/**
 * Skeleton Wrapper Component - Conditionally shows skeleton or content
 *
 * @example
 * ```tsx
 * <SkeletonWrapper isLoading={isLoading} width={100} height={20}>
 *   <Text>Content here</Text>
 * </SkeletonWrapper>
 *
 * <SkeletonWrapper isLoading={isLoading} width={60} type="circle">
 *   <Image source={avatar} />
 * </SkeletonWrapper>
 * ```
 */
export interface SkeletonWrapperProps extends Omit<SkeletonProps, 'animated'> {
  /**
   * Content to show when not loading
   */
  children: React.ReactNode;

  /**
   * Type of skeleton to show
   * @default 'rectangle'
   */
  type?: 'rectangle' | 'circle';

  /**
   * Whether to show skeleton (loading state)
   * @default false
   */
  isLoading?: boolean;
}

export function SkeletonWrapper({
  children,
  width = '100%',
  height = 20,
  type = 'rectangle',
  isLoading = false,
  ...props
}: SkeletonWrapperProps) {
  if (isLoading) {
    return (
      <Box>
        {type === 'rectangle' ? (
          <Skeleton width={width} height={height} {...props} />
        ) : (
          <SkeletonCircle size={typeof width === 'number' ? width : 20} {...props} />
        )}
      </Box>
    );
  }
  return <>{children}</>;
}
