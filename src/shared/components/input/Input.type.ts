import { ReactNode } from 'react';
import { TextInputProps, ViewStyle, LayoutChangeEvent } from 'react-native';
import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export interface InputProps extends TextInputProps {
  /**
   * Input label
   */
  label?: string;

  /**
   * Shows required indicator (*)
   */
  required?: boolean;

  /**
   * Helper text below input
   */
  helperText?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Success message to display
   */
  success?: string;

  /**
   * Character counter max value
   */
  maxLength?: number;

  /**
   * Show character counter
   */
  showCounter?: boolean;

  /**
   * Leading icon or element
   */
  leadingIcon?: ReactNode;

  /**
   * Trailing icon or element
   */
  trailingIcon?: ReactNode;

  /**
   * Text prefix (e.g., "$", "https://")
   */
  prefix?: string;

  /**
   * Text suffix (e.g., "USD", ".com")
   */
  suffix?: string;

  /**
   * Input size variant
   */
  size?: 'md' | 'lg';

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Read-only state
   */
  readOnly?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Container style
   */
  containerStyle?: ViewStyle;

  /**
   * Input wrapper style
   */
  wrapperStyle?: ViewStyle;

  /**
   * Custom className for input wrapper (for border, background, etc)
   */
  wrapperClassName?: string;

  /**
   * Border radius for input wrapper
   * @default 'md' (12px)
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

  /**
   * Callback when wrapper layout changes
   */
  onWrapperLayout?: (event: LayoutChangeEvent) => void;
}

type TRule<T extends FieldValues> = Omit<
  RegisterOptions<T>,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
>;

export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule<T>;
};

export interface ControlledInputProps<T extends FieldValues>
  extends Omit<InputProps, 'value' | 'onChangeText'>,
    InputControllerType<T> {}
