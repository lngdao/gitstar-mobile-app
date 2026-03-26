import { useMemo } from 'react';
import { useColorScheme } from 'nativewind';
import { storageHelpers, STORAGE_KEYS } from '@/libs/storage';
import { getThemeColors, colors as themeColors } from '@/shared/theme';

/**
 * useTheme Hook
 *
 * Provides theme state, control functions, and theme-aware colors.
 *
 * @example
 * ```tsx
 * const { theme, isDark, colors, setTheme, toggleTheme } = useTheme();
 *
 * // Use colors in styles where className is not available
 * <View style={{ backgroundColor: colors.bg.primary }}>
 *   <Text style={{ color: colors.text.primary }}>Hello</Text>
 * </View>
 * ```
 */
export const useTheme = () => {
  const { colorScheme, setColorScheme } = useColorScheme();

  const theme = (colorScheme ?? 'light') as 'light' | 'dark';
  const isDark = theme === 'dark';

  // Get theme-specific colors (memoized to avoid recalculation)
  const colors = useMemo(() => getThemeColors(theme), [theme]);

  // Custom setTheme that persists to storage
  const setTheme = (newTheme: 'light' | 'dark') => {
    setColorScheme(newTheme);

    // Persist to storage (safe to call after Application initialized)
    try {
      storageHelpers.setString(STORAGE_KEYS.THEME, newTheme);
    } catch (error) {
      console.warn('[useTheme] Storage not available, theme not persisted');
    }
  };

  // Custom toggleTheme that persists to storage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return {
    theme,
    isDark,
    colors,
    setTheme,
    toggleTheme,
    themeColors,
  };
};
