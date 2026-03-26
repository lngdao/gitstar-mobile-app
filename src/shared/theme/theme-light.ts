/**
 * Light Theme - Semantic Color Mappings
 *
 * Maps semantic tokens (text, bg, border, icon) to base colors
 * Optimized for light mode
 *
 * USAGE:
 * import { lightTheme, lightThemeVars } from '@/shared/theme/theme-light';
 * const textColor = lightTheme.text.primary;  // #000000
 */

import { colors } from './colors';
import { generateThemeVars } from './helpers';

export const lightTheme = {
  // ============================================
  // TEXT COLORS
  // ============================================
  text: {
    primary: colors.neutral[950], // #000000 - Main text
    secondary: colors.neutral[600], // #525252 - Secondary text
    tertiary: colors.neutral[500], // #717171 - Tertiary text
    disabled: colors.neutral[400], // #A1A1A1 - Disabled state
    inverse: colors.neutral[50], // #FAFAFA - Inverse (on dark bg)
    onColor: colors.white, // #FFFFFF - Text on colored backgrounds

    // Semantic text colors (darker shades for better contrast)
    success: colors.success[600], // #15AF77
    danger: colors.danger[600], // #DC2626
    warning: colors.warning[600], // #EA580C
    info: colors.info[600], // #2563EB
    brand: colors.primary[600], // #2563EB
  },

  // ============================================
  // BACKGROUND COLORS
  // ============================================
  bg: {
    // Neutral backgrounds (inverted)
    primary: colors.neutral[50], // #FAFAFA - Main background
    secondary: colors.neutral[100], // #F4F4F4 - Secondary background
    tertiary: colors.neutral[200], // #E4E4E4 - Tertiary background
    quaternary: colors.neutral[300], // #D4D4D4 - Quaternary background
    inverse: colors.neutral[950], // #000000 - Inverse (dark)

    // Semantic backgrounds (same as dark)
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
    overlay: colors.overlay.light[50], // 50% white overlay
  },

  // ============================================
  // BORDER COLORS
  // ============================================
  border: {
    primary: colors.neutral[200], // #E4E4E4 - Primary border
    secondary: colors.neutral[300], // #D4D4D4 - Secondary border
    tertiary: colors.neutral[400], // #A1A1A1 - Tertiary border
    inverse: colors.neutral[800], // #1C1C1C - Inverse border

    // Semantic borders (same as dark)
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
    primary: colors.neutral[950], // #000000 - Main icons
    secondary: colors.neutral[600], // #525252 - Secondary icons
    tertiary: colors.neutral[500], // #717171 - Tertiary icons
    disabled: colors.neutral[400], // #A1A1A1 - Disabled icons
    inverse: colors.neutral[50], // #FAFAFA - Inverse (on dark bg)
    onColor: colors.white, // #FFFFFF - Icons on colored backgrounds

    // Semantic icon colors (same as text for consistency)
    success: colors.success[600], // #15AF77
    danger: colors.danger[600], // #DC2626
    warning: colors.warning[600], // #EA580C
    info: colors.info[600], // #2563EB
    brand: colors.primary[600], // #2563EB
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
    secondary: colors.neutral[200],
    secondaryHover: colors.neutral[300],
    secondaryActive: colors.neutral[400],

    // Outline
    outline: 'transparent',
    outlineHover: colors.neutral[100],
    outlineActive: colors.neutral[200],

    // Danger
    danger: colors.danger[500],
    dangerHover: colors.danger[600],
    dangerActive: colors.danger[700],

    // Success
    success: colors.success[500],
    successHover: colors.success[600],
    successActive: colors.success[700],

    // Disabled
    disabled: colors.neutral[300],
  },
} as const;

// ============================================
// CSS VARIABLES FOR TAILWIND
// ============================================
export const lightThemeVars = generateThemeVars(lightTheme, colors);

// Type export
export type LightTheme = typeof lightTheme;
