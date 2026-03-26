/**
 * Dark Theme - Semantic Color Mappings
 *
 * Maps semantic tokens (text, bg, border, icon) to base colors
 * Optimized for dark mode (default theme)
 *
 * USAGE:
 * import { darkTheme, darkThemeVars } from '@/shared/theme/theme-dark';
 * const textColor = darkTheme.text.primary;  // #FAFAFA
 */

import { colors } from './colors';
import { generateThemeVars } from './helpers';

export const darkTheme = {
  // ============================================
  // TEXT COLORS
  // ============================================
  text: {
    primary: colors.neutral[50], // #FAFAFA - Main text
    secondary: colors.neutral[400], // #A1A1A1 - Secondary text
    tertiary: colors.neutral[500], // #717171 - Tertiary text
    disabled: colors.neutral[600], // #525252 - Disabled state
    inverse: colors.neutral[950], // #000000 - Inverse (on light bg)
    onColor: colors.white, // #FFFFFF - Text on colored backgrounds

    // Semantic text colors
    success: colors.success[500], // #1EC977
    danger: colors.danger[500], // #EF4444
    warning: colors.warning[500], // #F97316
    info: colors.info[500], // #3B82F6
    brand: colors.primary[500], // #3B82F6
  },

  // ============================================
  // BACKGROUND COLORS
  // ============================================
  bg: {
    // Neutral backgrounds
    primary: colors.neutral[950], // #000000 - Main background
    secondary: colors.neutral[900], // #121212 - Secondary background
    tertiary: colors.neutral[800], // #1C1C1C - Tertiary background
    quaternary: colors.neutral[700], // #272727 - Quaternary background
    inverse: colors.white, // #FFFFFF - Inverse (light)

    // Semantic backgrounds
    brand: colors.primary[500], // #3B82F6
    success: colors.success[500], // #1EC977
    danger: colors.danger[500], // #EF4444
    warning: colors.warning[500], // #F97316
    info: colors.info[500], // #3B82F6

    // Muted backgrounds (20% opacity for subtle highlights)
    brandMuted: colors.primary[500] + '33', // 20% opacity
    secondaryMuted: colors.neutral[500] + '29', // 16% opacity
    successMuted: colors.success[500] + '33',
    dangerMuted: colors.danger[500] + '33',
    warningMuted: colors.warning[500] + '33',
    infoMuted: colors.info[500] + '33',

    // Overlay
    overlay: colors.overlay.dark[50], // 50% black overlay
  },

  // ============================================
  // BORDER COLORS
  // ============================================
  border: {
    primary: colors.neutral[800], // #1C1C1C - Primary border
    secondary: colors.neutral[700], // #272727 - Secondary border
    tertiary: colors.neutral[600], // #525252 - Tertiary border
    inverse: colors.neutral[200], // #E4E4E4 - Inverse border

    // Semantic borders
    brand: colors.primary[500], // #3B82F6
    success: colors.success[500], // #1EC977
    danger: colors.danger[500], // #EF4444
    warning: colors.warning[500], // #F97316
    info: colors.info[500], // #3B82F6

    // Muted borders (20% opacity)
    brandMuted: colors.primary[500] + '33', // 20% opacity
    secondaryMuted: colors.neutral[500] + '33',
    successMuted: colors.success[500] + '33',
    dangerMuted: colors.danger[500] + '33',
    warningMuted: colors.warning[500] + '33',
    infoMuted: colors.info[500] + '33',
  },

  // ============================================
  // ICON COLORS
  // ============================================
  icon: {
    primary: colors.neutral[50], // #FAFAFA - Main icons
    secondary: colors.neutral[400], // #A1A1A1 - Secondary icons
    tertiary: colors.neutral[500], // #717171 - Tertiary icons
    disabled: colors.neutral[600], // #525252 - Disabled icons
    inverse: colors.neutral[950], // #000000 - Inverse (on light bg)
    onColor: colors.white, // #FFFFFF - Icons on colored backgrounds

    // Semantic icon colors
    success: colors.success[500], // #1EC977
    danger: colors.danger[500], // #EF4444
    warning: colors.warning[500], // #F97316
    info: colors.info[500], // #3B82F6
    brand: colors.primary[500], // #3B82F6
  },

  // ============================================
  // BUTTON COLORS (for inline styles)
  // ============================================
  button: {
    // Primary
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],

    // Secondary
    secondary: colors.neutral[800],
    secondaryHover: colors.neutral[700],
    secondaryActive: colors.neutral[600],

    // Outline
    outline: 'transparent',
    outlineHover: colors.neutral[800],
    outlineActive: colors.neutral[700],

    // Danger
    danger: colors.danger[500],
    dangerHover: colors.danger[600],
    dangerActive: colors.danger[700],

    // Success
    success: colors.success[500],
    successHover: colors.success[600],
    successActive: colors.success[700],

    // Disabled
    disabled: colors.neutral[700],
  },
} as const;

// ============================================
// CSS VARIABLES FOR TAILWIND
// ============================================
export const darkThemeVars = generateThemeVars(darkTheme, colors);

// Type export
export type DarkTheme = typeof darkTheme;
