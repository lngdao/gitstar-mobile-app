/**
 * Theme System - Expo Boilerplate Design System
 *
 * USAGE:
 *
 * 1. Semantic Design Tokens (Recommended - Auto theme switching):
 *    <Text className="text-text-primary">Hello</Text>
 *    <View className="bg-bg-primary">...</View>
 *    <View className="border-border-primary">...</View>
 *
 * 2. Base Colors (Manual theme control):
 *    <Text className="text-neutral-950 dark:text-neutral-50">Hello</Text>
 *    <View className="bg-primary-500/20">Muted background</View>
 *
 * 3. Inline Styles (when Tailwind not available):
 *    const { text, bg, border, icon } = useThemeColors();
 *    <Text style={{ color: text.primary }}>Hello</Text>
 *    <View style={{ backgroundColor: bg.primary }}>...</View>
 */

import { useColorScheme } from 'react-native';
import { darkTheme } from './theme-dark';
import { lightTheme } from './theme-light';

// ============================================
// EXPORTS
// ============================================

// Base colors
export { colors } from './colors';
export type { ColorScale, ColorShade } from './colors';

// Theme objects and CSS variables
export { darkTheme, darkThemeVars } from './theme-dark';
export { lightTheme, lightThemeVars } from './theme-light';
export type { DarkTheme } from './theme-dark';
export type { LightTheme } from './theme-light';

// Helper functions
export { hexToRgb, hexWithAlpha, generateThemeVars } from './helpers';

// Fonts
export { fonts } from './fonts';

// ============================================
// HOOK - useThemeColors
// ============================================

/**
 * Get theme-aware semantic colors based on current color scheme
 *
 * @returns Theme colors { text, bg, border, icon, button }
 *
 * @example
 * const { text, bg, border, icon } = useThemeColors();
 *
 * // Use in inline styles
 * <View style={{ backgroundColor: bg.primary, borderColor: border.primary }}>
 *   <Text style={{ color: text.primary }}>Hello</Text>
 * </View>
 *
 * // Status colors
 * <Text style={{ color: text.success }}>Success message</Text>
 * <Text style={{ color: text.danger }}>Error message</Text>
 */
export function useThemeColors() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}

/**
 * Get theme colors for a specific theme (without hook)
 * Useful for cases where you can't use hooks
 *
 * @param theme - 'light' or 'dark'
 * @returns Theme color object
 *
 * @example
 * const colors = getThemeColors('dark');
 * const textColor = colors.text.primary;
 */
export function getThemeColors(theme: 'light' | 'dark') {
  return theme === 'dark' ? darkTheme : lightTheme;
}

// ============================================
// TYPE EXPORTS
// ============================================

/**
 * Theme colors type
 * Can be used for dark or light theme
 */
export type ThemeColors = typeof darkTheme;

/**
 * Individual category types
 */
export type TextColors = ThemeColors['text'];
export type BgColors = ThemeColors['bg'];
export type BorderColors = ThemeColors['border'];
export type IconColors = ThemeColors['icon'];
export type ButtonColors = ThemeColors['button'];
