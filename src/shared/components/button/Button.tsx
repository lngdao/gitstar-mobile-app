import { useTheme } from '@/shared/hooks';
import { cn } from '@/utils/cn';
import React, { useState } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { tv, type VariantProps } from 'tailwind-variants';
import { Text } from '../Text';
import { ButtonContent, ButtonProps } from './Button.type';
import * as Haptics from 'expo-haptics';

/**
 * Button Variants - Based on Figma Design System
 *
 * Design Specs from Figma:
 * - Types: primary (lime green), secondary (white), danger (pink)
 * - Styles: filled, tonal (20% opacity), outline (border), ghost (transparent)
 * - Sizes: sm (28h), md (36h), lg (44h), xl (52h)
 * - States: default, hover, pressed, disabled, loading
 * - Content: text-only, icon-only, icon-leading, icon-trailing, icon-both
 */
export const buttonVariants = tv({
  slots: {
    container: 'flex flex-row items-center rounded-full',
    content: 'flex flex-row items-center',
    text: '', // Will use Text component with label variant
    iconWrapper: 'flex items-center justify-center shrink-0 self-center',
  },
  variants: {
    // ========================================
    // SIZE VARIANTS
    // ========================================
    size: {
      sm: {
        container: 'h-[28px]',
        content: 'gap-4',
        iconWrapper: '',
      },
      md: {
        container: 'h-[36px]',
        content: 'gap-6',
        iconWrapper: '',
      },
      lg: {
        container: 'h-[44px]',
        content: 'gap-8',
        iconWrapper: '',
      },
      xl: {
        container: 'h-[52px]',
        content: 'gap-10',
        iconWrapper: '',
      },
    },

    // ========================================
    // TYPE VARIANTS (Color schemes)
    // ========================================
    type: {
      primary: '',
      secondary: '',
      danger: '',
    },

    // ========================================
    // STYLE VARIANTS (Visual treatment)
    // ========================================
    variant: {
      filled: '',
      tonal: '',
      outline: '',
      ghost: '',
    },

    // ========================================
    // STATE VARIANTS
    // ========================================
    state: {
      default: '',
      hover: '',
      pressed: '',
      disabled: '',
    },

    // ========================================
    // CONTENT TYPE (affects padding)
    // ========================================
    content: {
      'text-only': '',
      'icon-only': '',
      'icon-leading': '',
      'icon-trailing': '',
      'icon-both': '',
    },

    // ========================================
    // FULL WIDTH
    // ========================================
    fullWidth: {
      true: {
        container: 'w-full',
      },
      false: {
        container: 'self-start',
      },
    },

    // ========================================
    // CONTENT ALIGNMENT
    // ========================================
    contentAlign: {
      start: {
        content: 'justify-start',
        container: 'justify-start',
      },
      center: {
        content: 'justify-center',
        container: 'justify-center',
      },
      end: {
        content: 'justify-end',
        container: 'justify-end',
      },
    },
  },

  // ========================================
  // COMPOUND VARIANTS
  // ========================================
  compoundVariants: [
    // ============================================================
    // PRIMARY + FILLED
    // ============================================================
    {
      type: 'primary',
      variant: 'filled',
      state: 'default',
      className: {
        container: 'bg-bg-brand',
      },
    },
    {
      type: 'primary',
      variant: 'filled',
      state: 'hover',
      className: {
        container: 'bg-bg-brand active:opacity-90',
      },
    },
    {
      type: 'primary',
      variant: 'filled',
      state: 'pressed',
      className: {
        container: 'bg-bg-brand opacity-80',
      },
    },

    // ============================================================
    // PRIMARY + TONAL
    // ============================================================
    {
      type: 'primary',
      variant: 'tonal',
      state: 'default',
      className: {
        container: 'bg-bg-brand/20',
      },
    },
    {
      type: 'primary',
      variant: 'tonal',
      state: 'hover',
      className: {
        container: 'bg-bg-brand/30 active:bg-bg-brand/25',
      },
    },
    {
      type: 'primary',
      variant: 'tonal',
      state: 'pressed',
      className: {
        container: 'bg-bg-brand/25',
      },
    },

    // ============================================================
    // PRIMARY + OUTLINE
    // ============================================================
    {
      type: 'primary',
      variant: 'outline',
      state: 'default',
      className: {
        container: 'bg-transparent border border-border-brand-muted',
      },
    },
    {
      type: 'primary',
      variant: 'outline',
      state: 'hover',
      className: {
        container: 'bg-bg-brand/10 border border-border-brand-muted',
      },
    },
    {
      type: 'primary',
      variant: 'outline',
      state: 'pressed',
      className: {
        container: 'bg-bg-brand/5 border border-border-brand-muted',
      },
    },

    // ============================================================
    // PRIMARY + GHOST
    // ============================================================
    {
      type: 'primary',
      variant: 'ghost',
      state: 'default',
      className: {
        container: 'bg-transparent',
      },
    },
    {
      type: 'primary',
      variant: 'ghost',
      state: 'hover',
      className: {
        container: 'bg-bg-brand/10',
      },
    },
    {
      type: 'primary',
      variant: 'ghost',
      state: 'pressed',
      className: {
        container: 'bg-bg-brand/5',
      },
    },

    // ============================================================
    // SECONDARY + FILLED
    // ============================================================
    {
      type: 'secondary',
      variant: 'filled',
      state: 'default',
      className: {
        container: 'bg-bg-inverse',
      },
    },
    {
      type: 'secondary',
      variant: 'filled',
      state: 'hover',
      className: {
        container: 'bg-bg-inverse active:opacity-90',
      },
    },
    {
      type: 'secondary',
      variant: 'filled',
      state: 'pressed',
      className: {
        container: 'bg-bg-inverse opacity-80',
      },
    },

    // ============================================================
    // SECONDARY + TONAL
    // ============================================================
    {
      type: 'secondary',
      variant: 'tonal',
      state: 'default',
      className: {
        container: 'bg-bg-secondary',
      },
    },
    {
      type: 'secondary',
      variant: 'tonal',
      state: 'hover',
      className: {
        container: 'bg-bg-tertiary active:bg-bg-secondary',
      },
    },
    {
      type: 'secondary',
      variant: 'tonal',
      state: 'pressed',
      className: {
        container: 'bg-bg-tertiary',
      },
    },

    // ============================================================
    // SECONDARY + OUTLINE
    // ============================================================
    {
      type: 'secondary',
      variant: 'outline',
      state: 'default',
      className: {
        container: 'bg-transparent border border-border-primary',
      },
    },
    {
      type: 'secondary',
      variant: 'outline',
      state: 'hover',
      className: {
        container: 'bg-bg-secondary border border-border-primary',
      },
    },
    {
      type: 'secondary',
      variant: 'outline',
      state: 'pressed',
      className: {
        container: 'bg-bg-tertiary border border-border-primary',
      },
    },

    // ============================================================
    // SECONDARY + GHOST
    // ============================================================
    {
      type: 'secondary',
      variant: 'ghost',
      state: 'default',
      className: {
        container: 'bg-transparent',
      },
    },
    {
      type: 'secondary',
      variant: 'ghost',
      state: 'hover',
      className: {
        container: 'bg-bg-secondary',
      },
    },
    {
      type: 'secondary',
      variant: 'ghost',
      state: 'pressed',
      className: {
        container: 'bg-bg-tertiary',
      },
    },

    // ============================================================
    // DANGER + FILLED
    // ============================================================
    {
      type: 'danger',
      variant: 'filled',
      state: 'default',
      className: {
        container: 'bg-bg-danger',
      },
    },
    {
      type: 'danger',
      variant: 'filled',
      state: 'hover',
      className: {
        container: 'bg-bg-danger active:opacity-90',
      },
    },
    {
      type: 'danger',
      variant: 'filled',
      state: 'pressed',
      className: {
        container: 'bg-bg-danger opacity-80',
      },
    },

    // ============================================================
    // DANGER + TONAL
    // ============================================================
    {
      type: 'danger',
      variant: 'tonal',
      state: 'default',
      className: {
        container: 'bg-bg-danger-muted/20',
      },
    },
    {
      type: 'danger',
      variant: 'tonal',
      state: 'hover',
      className: {
        container: 'bg-bg-danger-muted/30 active:bg-bg-danger-muted/25',
      },
    },
    {
      type: 'danger',
      variant: 'tonal',
      state: 'pressed',
      className: {
        container: 'bg-bg-danger-muted/25',
      },
    },

    // ============================================================
    // DANGER + OUTLINE
    // ============================================================
    {
      type: 'danger',
      variant: 'outline',
      state: 'default',
      className: {
        container: 'bg-transparent border border-border-danger-muted',
      },
    },
    {
      type: 'danger',
      variant: 'outline',
      state: 'hover',
      className: {
        container: 'bg-bg-danger-muted/10 border border-border-danger-muted',
      },
    },
    {
      type: 'danger',
      variant: 'outline',
      state: 'pressed',
      className: {
        container: 'bg-bg-danger-muted/5 border border-border-danger-muted',
      },
    },

    // ============================================================
    // DANGER + GHOST
    // ============================================================
    {
      type: 'danger',
      variant: 'ghost',
      state: 'default',
      className: {
        container: 'bg-transparent',
      },
    },
    {
      type: 'danger',
      variant: 'ghost',
      state: 'hover',
      className: {
        container: 'bg-bg-danger-muted/10',
      },
    },
    {
      type: 'danger',
      variant: 'ghost',
      state: 'pressed',
      className: {
        container: 'bg-bg-danger-muted/5',
      },
    },

    // ============================================================
    // DISABLED STATES - All types and variants
    // ============================================================
    // Primary filled disabled
    {
      type: 'primary',
      variant: 'filled',
      state: 'disabled',
      className: {
        container: 'bg-bg-brand opacity-40',
      },
    },
    // Primary tonal disabled
    {
      type: 'primary',
      variant: 'tonal',
      state: 'disabled',
      className: {
        container: 'bg-bg-brand/20 opacity-40',
      },
    },
    // Primary outline disabled
    {
      type: 'primary',
      variant: 'outline',
      state: 'disabled',
      className: {
        container: 'bg-transparent border border-border-brand-muted opacity-40',
      },
    },
    // Primary ghost disabled
    {
      type: 'primary',
      variant: 'ghost',
      state: 'disabled',
      className: {
        container: 'bg-transparent opacity-40',
      },
    },
    // Secondary filled disabled
    {
      type: 'secondary',
      variant: 'filled',
      state: 'disabled',
      className: {
        container: 'bg-bg-inverse opacity-40',
      },
    },
    // Secondary tonal disabled
    {
      type: 'secondary',
      variant: 'tonal',
      state: 'disabled',
      className: {
        container: 'bg-bg-secondary opacity-40',
      },
    },
    // Secondary outline disabled
    {
      type: 'secondary',
      variant: 'outline',
      state: 'disabled',
      className: {
        container: 'bg-transparent border border-border-primary opacity-40',
      },
    },
    // Secondary ghost disabled
    {
      type: 'secondary',
      variant: 'ghost',
      state: 'disabled',
      className: {
        container: 'bg-transparent opacity-40',
      },
    },
    // Danger filled disabled
    {
      type: 'danger',
      variant: 'filled',
      state: 'disabled',
      className: {
        container: 'bg-bg-danger opacity-40',
      },
    },
    // Danger tonal disabled
    {
      type: 'danger',
      variant: 'tonal',
      state: 'disabled',
      className: {
        container: 'bg-bg-danger-muted/20 opacity-40',
      },
    },
    // Danger outline disabled
    {
      type: 'danger',
      variant: 'outline',
      state: 'disabled',
      className: {
        container: 'bg-transparent border border-border-danger-muted opacity-40',
      },
    },
    // Danger ghost disabled
    {
      type: 'danger',
      variant: 'ghost',
      state: 'disabled',
      className: {
        container: 'bg-transparent opacity-40',
      },
    },

    // ============================================================
    // PADDING BASED ON SIZE + CONTENT TYPE
    // ============================================================
    // SM SIZE PADDING
    {
      size: 'sm',
      content: 'text-only',
      className: {
        container: 'px-12 py-6',
      },
    },
    {
      size: 'sm',
      content: 'icon-only',
      className: {
        container: 'w-[28px] p-0',
      },
    },
    {
      size: 'sm',
      content: 'icon-leading',
      className: {
        container: 'px-12 py-6',
      },
    },
    {
      size: 'sm',
      content: 'icon-trailing',
      className: {
        container: 'px-12 py-6',
      },
    },
    {
      size: 'sm',
      content: 'icon-both',
      className: {
        container: 'px-10 py-6',
      },
    },

    // MD SIZE PADDING
    {
      size: 'md',
      content: 'text-only',
      className: {
        container: 'px-16 py-8',
      },
    },
    {
      size: 'md',
      content: 'icon-only',
      className: {
        container: 'w-[36px] p-0',
      },
    },
    {
      size: 'md',
      content: 'icon-leading',
      className: {
        container: 'px-16 py-8',
      },
    },
    {
      size: 'md',
      content: 'icon-trailing',
      className: {
        container: 'px-16 py-8',
      },
    },
    {
      size: 'md',
      content: 'icon-both',
      className: {
        container: 'px-12 py-8',
      },
    },

    // LG SIZE PADDING
    {
      size: 'lg',
      content: 'text-only',
      className: {
        container: 'px-20 py-10',
      },
    },
    {
      size: 'lg',
      content: 'icon-only',
      className: {
        container: 'w-[44px] p-0',
      },
    },
    {
      size: 'lg',
      content: 'icon-leading',
      className: {
        container: 'px-20 py-10',
      },
    },
    {
      size: 'lg',
      content: 'icon-trailing',
      className: {
        container: 'px-20 py-10',
      },
    },
    {
      size: 'lg',
      content: 'icon-both',
      className: {
        container: 'px-14 py-10',
      },
    },

    // XL SIZE PADDING
    {
      size: 'xl',
      content: 'text-only',
      className: {
        container: 'px-24 py-12',
      },
    },
    {
      size: 'xl',
      content: 'icon-only',
      className: {
        container: 'w-[52px] p-0',
      },
    },
    {
      size: 'xl',
      content: 'icon-leading',
      className: {
        container: 'px-24 py-12',
      },
    },
    {
      size: 'xl',
      content: 'icon-trailing',
      className: {
        container: 'px-24 py-12',
      },
    },
    {
      size: 'xl',
      content: 'icon-both',
      className: {
        container: 'px-16 py-12',
      },
    },
  ],

  defaultVariants: {
    type: 'primary',
    variant: 'filled',
    size: 'md',
    state: 'default',
    content: 'text-only',
    fullWidth: false,
    contentAlign: 'center',
  },
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/**
 * Button - Comprehensive button component following Figma Design System
 *
 * Features:
 * - Multiple types: primary, secondary, danger
 * - Multiple styles: filled, tonal, outline, ghost
 * - Multiple sizes: sm, md, lg, xl
 * - States: default, hover, pressed, disabled, loading
 * - Icon support: leading, trailing, both, icon-only
 * - Full accessibility support
 * - Optimized for React Native
 */
export const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      children,
      type = 'primary',
      variant = 'filled',
      size = 'md',
      leadingIcon,
      trailingIcon,
      loading = false,
      disabled = false,
      className,
      textClassName,
      fullWidth = false,
      spinnerColor,
      contentAlign = 'center',
      haptic = false,
      onPress,
      ...pressableProps
    },
    ref,
  ) => {
    const { themeColors } = useTheme();
    const [isPressed, setIsPressed] = useState(false);

    // Determine content type
    const getContentType = (): ButtonContent => {
      const hasText = typeof children === 'string' || children !== undefined;
      const hasLeading = !!leadingIcon;
      const hasTrailing = !!trailingIcon;

      if (!hasText && !hasLeading && !hasTrailing) return 'text-only';
      if (!hasText && (hasLeading || hasTrailing)) return 'icon-only';
      if (hasLeading && hasTrailing) return 'icon-both';
      if (hasLeading) return 'icon-leading';
      if (hasTrailing) return 'icon-trailing';
      return 'text-only';
    };

    const contentType = getContentType();

    // Determine state
    const getState = (): ButtonVariantProps['state'] => {
      if (disabled) return 'disabled';
      if (isPressed) return 'pressed';
      return 'default';
    };

    const state = getState();
    const isDisabled = disabled || loading;

    const variants = buttonVariants({
      type,
      variant,
      size,
      state,
      content: contentType,
      fullWidth,
      contentAlign,
    });

    // Get text color based on button type and variant
    const getTextColor = (): 'onColor' | 'inverse' | 'primary' | 'brand' | 'danger' => {
      if (variant === 'filled') {
        return type === 'secondary' ? 'inverse' : 'onColor';
      }
      if (type === 'primary') return 'brand';
      if (type === 'danger') return 'danger';
      return 'primary';
    };

    // Loading spinner color
    const resolvedSpinnerColor = spinnerColor ?? themeColors.lime[500];

    // Get spinner size based on button size
    const getSpinnerSize = () => {
      if (size === 'sm') return 12;
      if (size === 'md') return 16;
      if (size === 'lg') return 20;
      return 24;
    };

    const handlePress = onPress
      ? (e: any) => {
          // Trigger haptic feedback if enabled
          if (haptic) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onPress(e);
        }
      : undefined;

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className={cn(variants.container(), className)}
        {...pressableProps}
      >
        <View className={variants.content()}>
          {/* Leading Icon or Loading Spinner */}
          {loading && (leadingIcon || contentType === 'icon-only' || contentType === 'text-only') ? (
            <View className={variants.iconWrapper()}>
              <ActivityIndicator color={resolvedSpinnerColor} size={getSpinnerSize() > 20 ? 'small' : 'small'} />
            </View>
          ) : leadingIcon ? (
            <View className={variants.iconWrapper()}>{leadingIcon}</View>
          ) : null}

          {/* Text Content */}
          {typeof children === 'string' && contentType !== 'icon-only' ? (
            <Text
              variant="label"
              size={size === 'sm' ? 'xs' : size === 'md' ? 'sm' : size === 'lg' ? 'sm' : 'lg'}
              color={getTextColor()}
              className={cn(
                'self-center',
                size === 'lg' && 'font-[500]',
                textClassName
              )}
            >
              {children}
            </Text>
          ) : (
            contentType !== 'icon-only' && children
          )}

          {/* Trailing Icon or Loading Spinner */}
          {loading && trailingIcon ? (
            <View className={variants.iconWrapper()}>
              <ActivityIndicator color={resolvedSpinnerColor} size="small" />
            </View>
          ) : trailingIcon ? (
            <View className={variants.iconWrapper()}>{trailingIcon}</View>
          ) : null}
        </View>
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
