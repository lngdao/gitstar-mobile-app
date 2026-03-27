/**
 * Base Color Palette - Expo Boilerplate Design System
 *
 * All colors defined ONCE.
 * These are primitive colors used across the app.
 * For theme-aware semantic colors, see theme-dark.ts and theme-light.ts
 */

export const colors = {
  // ============================================
  // BASE COLORS
  // ============================================
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // ============================================
  // NEUTRAL SCALE
  // ============================================
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F4',
    200: '#E4E4E4',
    300: '#D4D4D4',
    400: '#A1A1A1',
    500: '#717171',
    600: '#525252',
    700: '#272727',
    800: '#1C1C1C',
    900: '#121212',
    950: '#000000',
  },

  // ============================================
  // BRAND / PRIMARY (Blue)
  // ============================================
  primary: {
    300: '#D4917A',
    400: '#C5745A',
    500: '#B6573A', // Main brand color (terracotta)
    600: '#9A4A31',
    700: '#7E3D28',
  },

  // ============================================
  // SEMANTIC COLORS
  // ============================================
  success: {
    300: '#68D391',
    400: '#35DF8D',
    500: '#1EC977',
    600: '#15AF77',
    700: '#139B6B',
  },

  danger: {
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  info: {
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  warning: {
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
  },

  // ============================================
  // CUSTOM ACCENT COLORS
  // ============================================
  indigo: {
    400: '#818CF8',
    500: '#6366F1',
    600: '#7C3AED',
  },

  lime: {
    300: '#A0E635',
    400: '#97ED33',
    500: '#84CC16',
  },

  pink: {
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
  },

  teal: {
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
  },

  yellow: {
    400: '#FACC15',
    500: '#EAB308',
    600: '#CA8A04',
  },

  // ============================================
  // OVERLAY COLORS (with alpha)
  // ============================================
  overlay: {
    dark: {
      50: '#00000080',
    },
    light: {
      50: '#FFFFFF80',
    },
  },
} as const;

// Type exports
export type ColorScale = typeof colors.neutral;
export type ColorShade = keyof ColorScale;
