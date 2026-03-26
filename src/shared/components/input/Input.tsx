import React, { useState } from 'react';
import { TextInput, View, ActivityIndicator } from 'react-native';
import { tv, type VariantProps } from 'tailwind-variants';
import { ControlledInputProps, InputProps } from './Input.type';
import { FieldValues, useController } from 'react-hook-form';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Text } from '../Text';
import { useTheme } from '@/shared/hooks';
import { cn } from '@/utils/cn';

/**
 * Input Variants - Based on Figma Design System
 */
export const inputVariants = tv({
  slots: {
    container: 'flex flex-col gap-8 w-full',
    header: 'flex flex-row gap-4 items-end',
    labelWrapper: 'flex flex-row gap-2 items-center',
    label: '',
    required: '',
    inputWrapper: 'flex flex-row gap-8 items-center rounded-[8px] flex-shrink-0',
    inputContainer: 'flex-1',
    input: 'flex-1',
    footer: 'flex flex-row gap-8 items-center justify-end',
    helperText: 'flex-1',
    counter: '',
    icon: 'flex items-center justify-center',
    prefixSuffix: 'flex items-center',
  },
  variants: {
    size: {
      md: {
        inputWrapper: '',
        input: 'text-[14px] font-inter-regular',
        icon: 'w-[16px] h-[16px] p-[2px]',
        prefixSuffix: '',
      },
      lg: {
        inputWrapper: '',
        input: 'text-[16px] font-inter-regular',
        icon: 'w-[20px] h-[20px] p-[2px]',
        prefixSuffix: '',
      },
    },
    rounded: {
      none: {
        inputWrapper: 'rounded-none',
      },
      sm: {
        inputWrapper: 'rounded-[4px]',
      },
      md: {
        inputWrapper: 'rounded-[12px]',
      },
      lg: {
        inputWrapper: 'rounded-[16px]',
      },
      xl: {
        inputWrapper: 'rounded-[20px]',
      },
      '2xl': {
        inputWrapper: 'rounded-[24px]',
      },
      full: {
        inputWrapper: 'rounded-full',
      },
    },
    hasLeadingContent: {
      true: {},
      false: {},
    },
    hasTrailingContent: {
      true: {},
      false: {},
    },
    multiline: {
      true: {
        inputWrapper: 'items-start',
        input: '',
      },
      false: {
        inputWrapper: 'items-center',
        input: '',
      },
    },
    state: {
      default: {
        inputWrapper: 'bg-bg-tertiary',
        input: 'text-text-primary',
      },
      focus: {
        inputWrapper: 'bg-bg-tertiary',
        input: 'text-text-primary',
      },
      error: {
        inputWrapper: 'bg-bg-danger-muted/10',
        input: 'text-text-primary',
      },
      success: {
        inputWrapper: 'bg-bg-success-muted/10',
        input: 'text-text-primary',
      },
      disabled: {
        inputWrapper: 'bg-bg-tertiary opacity-50',
        input: 'text-text-disabled',
      },
      readOnly: {
        inputWrapper: 'bg-bg-tertiary',
        input: 'text-text-secondary',
      },
    },
  },
  compoundVariants: [
    // MD size - text-only: pl-12 pr-8 py-10
    {
      size: 'md',
      hasLeadingContent: false,
      hasTrailingContent: false,
      className: {
        inputWrapper: 'pl-12 pr-8 py-10',
      },
    },
    // MD size - with leading, no trailing: px-8 py-10
    {
      size: 'md',
      hasLeadingContent: true,
      hasTrailingContent: false,
      className: {
        inputWrapper: 'px-8 py-10',
      },
    },
    // MD size - no leading, with trailing: pl-12 pr-8 py-10
    {
      size: 'md',
      hasLeadingContent: false,
      hasTrailingContent: true,
      className: {
        inputWrapper: 'pl-12 pr-8 py-10',
      },
    },
    // MD size - with both leading and trailing: px-8 py-10
    {
      size: 'md',
      hasLeadingContent: true,
      hasTrailingContent: true,
      className: {
        inputWrapper: 'px-8 py-10',
      },
    },
    // LG size: px-16 py-12
    {
      size: 'lg',
      className: {
        inputWrapper: 'px-16 py-12',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    state: 'default',
    multiline: false,
    hasLeadingContent: false,
    hasTrailingContent: false,
    rounded: 'md',
  },
});

type InputVariantProps = VariantProps<typeof inputVariants>;

/**
 * Input - Comprehensive input component following Figma Design System
 *
 * Features:
 * - Multiple sizes (md, lg)
 * - States: default, focus, error, success, disabled, readOnly, loading
 * - Leading/trailing icons
 * - Prefix/suffix text
 * - Label, helper text, error message
 * - Character counter
 * - Full accessibility support
 */
const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    label,
    required,
    helperText,
    error,
    success,
    maxLength,
    showCounter = false,
    leadingIcon,
    trailingIcon,
    prefix,
    suffix,
    size = 'md',
    disabled = false,
    readOnly = false,
    loading = false,
    containerStyle,
    wrapperStyle,
    value,
    defaultValue,
    placeholder,
    placeholderTextColor,
    onFocus,
    onBlur,
    onChangeText,
    wrapperClassName,
    rounded = 'md',
    onWrapperLayout,
    className,
    ...inputProps
  } = props;

  const { themeColors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  // Check if component is controlled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Check if multiline
  const isMultiline = inputProps.multiline === true;

  // Auto-show loading indicator or trailing icon
  const effectiveTrailingIcon = loading ? (
    <ActivityIndicator color={themeColors.lime[500]} size={size === 'lg' ? 'small' : 'small'} />
  ) : (
    trailingIcon
  );

  // Check if has leading/trailing content
  const hasLeadingContent = !!(leadingIcon || prefix);
  const hasTrailingContent = !!(effectiveTrailingIcon || suffix);

  // Determine state
  const getState = (): InputVariantProps['state'] => {
    if (disabled) return 'disabled';
    if (readOnly) return 'readOnly';
    if (error) return 'error';
    if (success) return 'success';
    if (isFocused) return 'focus';
    return 'default';
  };

  const state = getState();
  const variants = inputVariants({
    size,
    state,
    multiline: isMultiline,
    hasLeadingContent,
    hasTrailingContent,
    rounded,
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    if (!isControlled) {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  const characterCount = currentValue?.toString().length || 0;

  return (
    <View style={[{ minWidth: 0, width: '100%' }, containerStyle]} className={variants.container()}>
      {/* Header: Label + Required */}
      {label && (
        <View className={variants.header()}>
          <View className={variants.labelWrapper()}>
            <Text variant="label" size="sm" color="primary">
              {label}
            </Text>
          </View>
          {required && (
            <Text variant="label" size="sm" color="primary">
              *
            </Text>
          )}
        </View>
      )}

      {/* Input Wrapper */}
      <View
        style={[{ flexShrink: 0 }, wrapperStyle]}
        className={`${variants.inputWrapper()} ${wrapperClassName || ''}`}
        onLayout={onWrapperLayout}
      >
        {/* Leading Icon */}
        {leadingIcon && <View className={variants.icon()}>{leadingIcon}</View>}

        {/* Prefix */}
        {prefix && (
          <Text
            variant="body"
            size={size === 'lg' ? 'lg' : 'md'}
            color="secondary"
            className={variants.prefixSuffix()}
          >
            {prefix}
          </Text>
        )}

        {/* Input Container */}
        <View className={variants.inputContainer()}>
          <TextInput
            ref={ref}
            value={currentValue}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor || '#717171'}
            cursorColor={themeColors.lime[500]}
            selectionColor={themeColors.lime[500]}
            editable={!disabled && !readOnly}
            maxLength={maxLength}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            className={cn(variants.input(), className)}
            style={{
              includeFontPadding: false,
              paddingHorizontal: 0,
              paddingVertical: 0,
              textAlignVertical: 'center',
              height: size === 'lg' ? 20 : 16,
              lineHeight: size === 'lg' ? 20 : 16,
            }}
            {...inputProps}
          />
        </View>

        {/* Suffix */}
        {suffix && (
          <Text
            variant="body"
            size={size === 'lg' ? 'lg' : 'md'}
            color="secondary"
            className={variants.prefixSuffix()}
          >
            {suffix}
          </Text>
        )}

        {/* Trailing Icon */}
        {effectiveTrailingIcon && <View className={variants.icon()}>{effectiveTrailingIcon}</View>}
      </View>

      {/* Footer: Helper Text / Error Message + Counter */}
      {(helperText || error || success || showCounter) && (
        <View className={variants.footer()}>
          {/* Helper / Error / Success Text */}
          <Text
            variant="body"
            size="sm"
            color={error ? 'danger' : success ? 'success' : 'tertiary'}
            className={variants.helperText()}
          >
            {error || success || helperText || ''}
          </Text>

          {/* Character Counter */}
          {showCounter && maxLength && (
            <Text variant="label" size="sm" color="tertiary" className={variants.counter()}>
              {characterCount}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

Input.displayName = 'Input';

/**
 * ControlledInput - Input component integrated with react-hook-form
 *
 * @example
 * ```tsx
 * <ControlledInput
 *   name="email"
 *   control={control}
 *   rules={{ required: 'Email is required' }}
 *   label="Email"
 *   placeholder="Enter your email"
 * />
 * ```
 */
const ControlledInput = <T extends FieldValues>(props: ControlledInputProps<T>) => {
  const { name, control, rules, ...inputProps } = props;

  const { t } = useTranslation();
  const { field, fieldState } = useController({ control, name, rules });

  // Try to translate error message if it's a translation key
  const errorMessage = fieldState.error?.message
    ? (() => {
        try {
          return t(fieldState.error.message as any);
        } catch {
          return fieldState.error.message;
        }
      })()
    : undefined;

  return (
    <Input
      ref={field.ref}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      value={(field.value as string) || ''}
      error={errorMessage}
      {...inputProps}
    />
  );
};

export { Input, ControlledInput };
