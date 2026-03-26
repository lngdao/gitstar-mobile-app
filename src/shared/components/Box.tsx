import React from 'react';
import { View, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Box Variants - Layout primitive with semantic design tokens
 *
 * @example
 * // Using variants (recommended)
 * <Box bg="primary" padding={16} radius="lg">Content</Box>
 * <Box bg="brand" padding={24} radius="xl" border="brand">Card</Box>
 * <Box bg="success-muted" border="success" padding={12}>Success Alert</Box>
 *
 * // Using className (override/custom)
 * <Box className="items-center justify-center flex-1">Custom</Box>
 *
 * // Combining variants + className
 * <Box bg="secondary" padding={16} className="flex-row gap-2">
 *   Hybrid
 * </Box>
 *
 * // With shadows
 * <Box bg="primary" padding={24} radius="lg" shadow="md">Card with shadow</Box>
 */
export const boxVariants = tv({
  base: '',
  variants: {
    // Background variants (using semantic design tokens)
    bg: {
      primary: 'bg-bg-primary',
      secondary: 'bg-bg-secondary',
      tertiary: 'bg-bg-tertiary',
      quaternary: 'bg-bg-quaternary',
      inverse: 'bg-bg-inverse',
      brand: 'bg-bg-brand',
      success: 'bg-bg-success',
      danger: 'bg-bg-danger',
      warning: 'bg-bg-warning',
      info: 'bg-bg-info',
      'brand-muted': 'bg-bg-brand-muted',
      'success-muted': 'bg-bg-success-muted',
      'danger-muted': 'bg-bg-danger-muted',
      'warning-muted': 'bg-bg-warning-muted',
      'info-muted': 'bg-bg-info-muted',
      transparent: 'bg-transparent',
    },

    // Border variants (using semantic design tokens)
    border: {
      none: 'border-0',
      primary: 'border border-border-primary',
      secondary: 'border border-border-secondary',
      tertiary: 'border border-border-tertiary',
      inverse: 'border border-border-inverse',
      brand: 'border border-border-brand',
      success: 'border border-border-success',
      danger: 'border border-border-danger',
      warning: 'border border-border-warning',
      info: 'border border-border-info',
      'brand-muted': 'border border-border-brand-muted',
      'success-muted': 'border border-border-success-muted',
      'danger-muted': 'border border-border-danger-muted',
      'warning-muted': 'border border-border-warning-muted',
      'info-muted': 'border border-border-info-muted',
    },

    // Padding variants (from tailwind.config.js spacing - Figma Design System)
    padding: {
      0: 'p-0',
      2: 'p-2',
      4: 'p-4',
      6: 'p-6',
      8: 'p-8',
      10: 'p-10',
      12: 'p-12',
      16: 'p-16',
      20: 'p-20',
      24: 'p-24',
      32: 'p-32',
      40: 'p-40',
      48: 'p-48',
      56: 'p-56',
      64: 'p-64',
    },

    // Border radius variants (from tailwind.config.js - Figma Design System)
    radius: {
      none: 'rounded-none',
      xs: 'rounded-xs',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    },

    // Shadow variants (from tailwind.config.js - Figma Design System)
    shadow: {
      none: '',
      xs: 'shadow-xs',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
      tooltip: 'shadow-tooltip',
      toast: 'shadow-toast',
      modal: 'shadow-modal',
    },
  },
  defaultVariants: {
    bg: undefined,
    border: 'none',
    padding: undefined,
    radius: undefined,
    shadow: undefined,
  },
});

export interface BoxProps extends ViewProps, VariantProps<typeof boxVariants> {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Box - Universal layout primitive with semantic design tokens
 *
 * Supports both variant-based styling and className override
 *
 * @example
 * // Using variants (recommended - auto theme switching)
 * <Box bg="primary" padding={16} radius="lg">
 *   <Text>Content</Text>
 * </Box>
 *
 * // Using className for layout
 * <Box className="items-center justify-center flex-1">
 *   <Text>Centered</Text>
 * </Box>
 *
 * // Combining variants + className
 * <Box bg="brand" padding={24} radius="xl" className="flex-row gap-2">
 *   <Text>Hybrid</Text>
 * </Box>
 *
 * // Card example
 * <Box bg="secondary" padding={24} radius="lg" border="primary" shadow="md">
 *   <Text variant="heading" size="md">Card Title</Text>
 *   <Text variant="body" size="sm">Card content</Text>
 * </Box>
 */
export const Box = React.forwardRef<View, BoxProps>(
  ({ children, bg, border, padding, radius, shadow, className = '', ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={boxVariants({ bg, border, padding, radius, shadow, className })}
        {...props}
      >
        {children}
      </View>
    );
  },
);

Box.displayName = 'Box';

/**
 * AnimatedBox - Animated version using Reanimated
 */
export const AnimatedBox = Animated.createAnimatedComponent(Box);
