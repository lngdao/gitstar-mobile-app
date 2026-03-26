import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Text Variants - Compound pattern based on Figma typography system
 *
 * Categories: Display, Heading, Label, Body
 *
 * @example
 * // Using variants (recommended)
 * <Text variant="display" size="lg">Large Display</Text>
 * <Text variant="heading" size="md" color="primary">Heading</Text>
 * <Text variant="label" size="sm" color="secondary">Label</Text>
 * <Text variant="body" size="md">Body text</Text>
 *
 */
export const textVariants = tv({
  base: 'font-inter-regular',
  variants: {
    // Typography category
    variant: {
      display: '',
      heading: '',
      label: '',
      body: '',
    },
    // Size variants
    size: {
      // Display sizes
      lg: '',
      md: '',
      // Heading sizes
      sm: '',
      // Label/Body sizes
      xs: '',
      '2xs': '',
    },
    // Color variants (using semantic design tokens from tailwind.config.js)
    color: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      tertiary: 'text-text-tertiary',
      disabled: 'text-text-disabled',
      inverse: 'text-text-inverse',
      onColor: 'text-text-on-color',
      success: 'text-text-success',
      danger: 'text-text-danger',
      warning: 'text-text-warning',
      info: 'text-text-info',
      brand: 'text-text-brand',
      white: 'text-white',
      yellow: 'text-yellow-400',
      overlay: 'text-[#FFFFFF99]',
    },
  },
  compoundVariants: [
    // ========================================
    // DISPLAY VARIANTS
    // ========================================
    // Display Large: 72px/80px Medium
    {
      variant: 'display',
      size: 'lg',
      className: 'text-[72px] leading-[80px] font-inter-medium font-[500]',
    },
    // Display Medium: 36px/44px Medium
    {
      variant: 'display',
      size: 'md',
      className: 'text-[36px] leading-[44px] font-inter-medium font-[600]',
    },

    // ========================================
    // HEADING VARIANTS
    // ========================================
    // Heading Large: 28px/36px SemiBold
    {
      variant: 'heading',
      size: 'lg',
      className: 'text-[28px] leading-[36px] font-inter-semibold font-[600]',
    },
    // Heading Medium: 24px/32px SemiBold
    {
      variant: 'heading',
      size: 'md',
      className: 'text-[24px] leading-[32px] font-inter-semibold font-[600]',
    },
    // Heading Small: 20px/28px Medium
    {
      variant: 'heading',
      size: 'sm',
      className: 'text-[20px] leading-[28px] font-inter-medium font-[600]',
    },

    // ========================================
    // LABEL VARIANTS
    // ========================================
    // Label Large: 18px/28px Medium
    {
      variant: 'label',
      size: 'lg',
      className: 'text-[18px] leading-[28px] font-inter-medium font-[600]',
    },
    // Label Medium: 16px/24px Medium
    {
      variant: 'label',
      size: 'md',
      className: 'text-[16px] leading-[24px] font-inter-medium font-[600]',
    },
    // Label Small: 14px/20px Medium
    {
      variant: 'label',
      size: 'sm',
      className: 'text-[14px] leading-[20px] font-inter-medium font-[600]',
    },
    // Label XSmall: 12px/16px Medium
    {
      variant: 'label',
      size: 'xs',
      className: 'text-[12px] leading-[16px] font-inter-medium font-[600]',
    },
    // Label 2XSmall: 10px/12px Medium + Uppercase
    {
      variant: 'label',
      size: '2xs',
      className: 'text-[10px] leading-[12px] font-inter-medium font-[600] uppercase',
    },

    // ========================================
    // BODY VARIANTS
    // ========================================
    // Body Large: 18px/28px Regular
    {
      variant: 'body',
      size: 'lg',
      className: 'text-[18px] leading-[28px] font-inter-regular',
    },
    // Body Medium: 16px/24px Regular
    {
      variant: 'body',
      size: 'md',
      className: 'text-[16px] leading-[24px] font-inter-regular',
    },
    // Body Small: 14px/20px Regular
    {
      variant: 'body',
      size: 'sm',
      className: 'text-[14px] leading-[20px] font-inter-regular',
    },
    // Body XSmall: 12px/16px Regular
    {
      variant: 'body',
      size: 'xs',
      className: 'text-[12px] leading-[16px] font-inter-regular',
    },
    // Body 2XSmall: 10px/12px Regular
    {
      variant: 'body',
      size: '2xs',
      className: 'text-[10px] leading-[12px] font-inter-regular',
    },
  ],
  defaultVariants: {
    variant: 'body',
    size: 'md',
    color: 'primary',
  },
});

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {
  children?: React.ReactNode;
  className?: string;
  /**
   * Automatically wrap text after specified number of words.
   * Inserts line breaks to prevent text from being too long on one line.
   * Only applies to string children.
   *
   * @example
   * <Text wrapAfterWords={5}>
   *   This is a very long text that will wrap after every 5 words
   * </Text>
   */
  wrapAfterWords?: number;
}

/**
 * Text - Typography component with variant support
 *
 * Supports both variant-based styling and className override
 *
 * @example
 * // Using variants (recommended)
 * <Text variant="heading" size="lg" color="primary">
 *   Welcome
 * </Text>
 *
 * // Using className for custom styles
 * <Text variant="body" className="text-danger-500 italic">
 *   Error message
 * </Text>
 *
 * // Compound variants
 * <Text variant="display" size="lg" color="brand">
 *   Hero Title
 * </Text>
 */
export const Text = React.forwardRef<RNText, TextProps>(
  ({ children, variant, size, color, className = '', wrapAfterWords, ...props }, ref) => {
    // Process text wrapping if wrapAfterWords is specified and children is a string
    const processedChildren = React.useMemo(() => {
      if (wrapAfterWords && typeof children === 'string') {
        const words = children.split(/\s+/);
        const wrappedWords: string[] = [];

        for (let i = 0; i < words.length; i++) {
          if (i > 0 && i % wrapAfterWords === 0) {
            wrappedWords.push('\n');
          }
          wrappedWords.push(words[i]);
        }

        return wrappedWords.join(' ');
      }
      return children;
    }, [children, wrapAfterWords]);

    return (
      <RNText ref={ref} className={textVariants({ variant, size, color, className })} {...props}>
        {processedChildren}
      </RNText>
    );
  },
);

Text.displayName = 'Text';

/**
 * AnimatedText - Animated version using Reanimated
 */
export const AnimatedText = Animated.createAnimatedComponent(Text);
