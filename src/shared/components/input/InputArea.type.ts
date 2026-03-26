import { TextInputProps, ViewStyle } from 'react-native';
import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export interface InputAreaProps extends Omit<TextInputProps, 'multiline'> {
  /**
   * Textarea label
   */
  label?: string;

  /**
   * Shows required indicator (*)
   */
  required?: boolean;

  /**
   * Helper text below textarea
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
   * Textarea size variant
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
   * Loading state - shows spinner in footer
   */
  loading?: boolean;

  /**
   * Container style
   */
  containerStyle?: ViewStyle;

  /**
   * Textarea wrapper style
   */
  wrapperStyle?: ViewStyle;

  /**
   * Minimum number of lines to display
   * @default 4
   */
  minLines?: number;
}

type TRule<T extends FieldValues> = Omit<
  RegisterOptions<T>,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
>;

export type InputAreaControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule<T>;
};

export interface ControlledInputAreaProps<T extends FieldValues>
  extends Omit<InputAreaProps, 'value' | 'onChangeText'>,
    InputAreaControllerType<T> {}
