import { ReactNode } from 'react';
import { PressableProps } from 'react-native';

/**
 * Button Type variants based on Figma Design System
 * - primary: Main brand color (lime green #97ED33)
 * - secondary: White/light background
 * - danger: Destructive actions (pink/red)
 */
export type ButtonType = 'primary' | 'secondary' | 'danger';

/**
 * Button Style variants based on Figma Design System
 * - filled: Solid background color
 * - tonal: Muted/transparent background with 20% opacity
 * - outline: Border with transparent background
 * - ghost: No background, no border
 */
export type ButtonStyle = 'filled' | 'tonal' | 'outline' | 'ghost';

/**
 * Button Size variants based on Figma Design System
 * - sm: Small (28px height, 12px text, 6px padding, 6px radius)
 * - md: Medium (36px height, 14px text, 8px padding, 8px radius)
 * - lg: Large (44px height, 16px text, 10px padding, 10px radius)
 * - xl: Extra Large (52px height, 18px text, 12px padding, 12px radius)
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button State
 * States are automatically handled by the component:
 * - default: Normal state
 * - hover: User is hovering (web only, simulated via press feedback on mobile)
 * - pressed: Button is being pressed
 * - disabled: Button is disabled
 * - loading: Button is in loading state
 */
export type ButtonState = 'default' | 'hover' | 'pressed' | 'disabled' | 'loading';

/**
 * Button Content Type
 * - text-only: Only text
 * - icon-only: Only icon (square button)
 * - icon-leading: Icon on the left, text on the right
 * - icon-trailing: Text on the left, icon on the right
 * - icon-both: Icons on both sides of text
 */
export type ButtonContent = 'text-only' | 'icon-only' | 'icon-leading' | 'icon-trailing' | 'icon-both';

/**
 * Button Content Alignment
 * - start: Align content to the start (left)
 * - center: Align content to the center (default)
 * - end: Align content to the end (right)
 */
export type ButtonContentAlign = 'start' | 'center' | 'end';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /**
   * Button children - can be string or custom elements
   */
  children?: ReactNode;

  /**
   * Button type variant
   * @default 'primary'
   */
  type?: ButtonType;

  /**
   * Button style variant
   * @default 'filled'
   */
  variant?: ButtonStyle;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Leading icon element (left side)
   */
  leadingIcon?: ReactNode;

  /**
   * Trailing icon element (right side)
   */
  trailingIcon?: ReactNode;

  /**
   * Loading state - shows spinner
   */
  loading?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Custom className for button container
   */
  className?: string;

  /**
   * Custom className for button text
   */
  textClassName?: string;

  /**
   * Full width button
   */
  fullWidth?: boolean;

  /**
   * Custom spinner color when loading
   */
  spinnerColor?: string;

  /**
   * Content alignment within button
   * @default 'center'
   */
  contentAlign?: ButtonContentAlign;

  /**
   * Enable haptic feedback on press
   * @default false
   */
  haptic?: boolean;
}
