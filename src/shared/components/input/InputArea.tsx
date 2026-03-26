import React, { useState } from 'react';
import { TextInput, View, ActivityIndicator } from 'react-native';
import { tv, type VariantProps } from 'tailwind-variants';
import { ControlledInputAreaProps, InputAreaProps } from './InputArea.type';
import { FieldValues, useController } from 'react-hook-form';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Text } from '../Text';
import { useTheme } from '@/shared/hooks';

/**
 * InputArea Variants - Based on Figma Design System
 */
export const inputAreaVariants = tv({
  slots: {
    container: 'flex flex-col gap-8',
    header: 'flex flex-row gap-4 items-end',
    labelWrapper: 'flex flex-row gap-2 items-center',
    label: '',
    required: '',
    textareaWrapper: 'flex flex-col rounded-[8px]',
    textarea: 'flex-1',
    footer: 'flex flex-row gap-8 items-center justify-end',
    helperText: 'flex-1',
    counter: '',
  },
  variants: {
    size: {
      md: {
        textareaWrapper: 'px-12 py-8 min-h-[96px]',
        textarea: 'text-[14px] font-inter-regular',
      },
      lg: {
        textareaWrapper: 'px-16 py-10 min-h-[116px] rounded-[10px]',
        textarea: 'text-[16px] font-inter-regular',
      },
    },
    state: {
      default: {
        textareaWrapper: 'bg-bg-secondary',
        textarea: 'text-text-primary',
      },
      focus: {
        textareaWrapper: 'bg-bg-secondary',
        textarea: 'text-text-primary',
      },
      error: {
        textareaWrapper: 'bg-bg-danger-muted/10',
        textarea: 'text-text-primary',
      },
      success: {
        textareaWrapper: 'bg-bg-success-muted/10',
        textarea: 'text-text-primary',
      },
      disabled: {
        textareaWrapper: 'bg-bg-secondary opacity-50',
        textarea: 'text-text-disabled',
      },
      readOnly: {
        textareaWrapper: 'bg-bg-tertiary',
        textarea: 'text-text-secondary',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});

type InputAreaVariantProps = VariantProps<typeof inputAreaVariants>;

/**
 * InputArea - Multiline textarea component following Figma Design System
 *
 * Features:
 * - Multiple sizes (md, lg)
 * - States: default, focus, error, success, disabled, readOnly, loading
 * - Label, helper text, error message
 * - Character counter
 * - Full accessibility support
 * - Optimized for multiline text input
 */
const InputArea = React.forwardRef<TextInput, InputAreaProps>((props, ref) => {
  const {
    label,
    required,
    helperText,
    error,
    success,
    maxLength,
    showCounter = false,
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
    minLines = 4,
    ...textareaProps
  } = props;

  const { themeColors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  // Check if component is controlled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Determine state
  const getState = (): InputAreaVariantProps['state'] => {
    if (disabled) return 'disabled';
    if (readOnly) return 'readOnly';
    if (error) return 'error';
    if (success) return 'success';
    if (isFocused) return 'focus';
    return 'default';
  };

  const state = getState();
  const variants = inputAreaVariants({
    size,
    state,
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
    <View style={containerStyle} className={variants.container()}>
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

      {/* Textarea Wrapper */}
      <View style={wrapperStyle} className={variants.textareaWrapper()}>
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
          multiline
          numberOfLines={minLines}
          textAlignVertical="top"
          className={variants.textarea()}
          style={{
            includeFontPadding: false,
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}
          {...textareaProps}
        />
      </View>

      {/* Footer: Helper Text / Error Message + Counter / Loading */}
      {(helperText || error || success || showCounter || loading) && (
        <View className={variants.footer()}>
          {/* Loading Indicator */}
          {loading && (
            <ActivityIndicator
              color={themeColors.lime[500]}
              size="small"
            />
          )}

          {/* Helper / Error / Success Text */}
          {!loading && (
            <Text
              variant="body"
              size="sm"
              color={error ? 'danger' : success ? 'success' : 'tertiary'}
              className={variants.helperText()}
            >
              {error || success || helperText || ''}
            </Text>
          )}

          {/* Character Counter */}
          {showCounter && maxLength && (
            <Text
              variant="label"
              size="sm"
              color="tertiary"
              className={variants.counter()}
            >
              {characterCount}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

InputArea.displayName = 'InputArea';

/**
 * ControlledInputArea - InputArea component integrated with react-hook-form
 */
const ControlledInputArea = <T extends FieldValues>(
  props: ControlledInputAreaProps<T>,
) => {
  const { name, control, rules, ...textareaProps } = props;

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
    <InputArea
      ref={field.ref}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      value={(field.value as string) || ''}
      error={errorMessage}
      {...textareaProps}
    />
  );
};

export { InputArea, ControlledInputArea };
