/**
 * Theme Helper Functions
 * Utilities for color conversion and manipulation
 */

/**
 * Convert hex color to RGB string format for CSS variables
 * @param hex - Hex color string (e.g., "#FFFFFF" or "#FFF")
 * @returns RGB string (e.g., "255 255 255") for use with CSS variables
 *
 * @example
 * hexToRgb('#FFFFFF') // "255 255 255"
 * hexToRgb('#000') // "0 0 0"
 */
export function hexToRgb(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Handle 3-digit hex codes
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex;

  // Convert to RGB
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return `${r} ${g} ${b}`;
}

/**
 * Add alpha channel to hex color
 * @param hex - Hex color string
 * @param alpha - Alpha value (0-100)
 * @returns Hex color with alpha channel
 *
 * @example
 * hexWithAlpha('#FFFFFF', 50) // "#FFFFFF80"
 */
export function hexWithAlpha(hex: string, alpha: number): string {
  const alphaHex = Math.round((alpha / 100) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${alphaHex}`;
}

/**
 * Generate CSS variable mappings from a theme object
 * Eliminates duplication between dark and light theme var generation
 *
 * @param theme - Theme object with text, bg, border, icon, button categories
 * @param baseColors - Base color palette for muted/overlay values
 * @returns Object mapping CSS variable names to RGB strings
 */
export function generateThemeVars(
  theme: {
    text: Record<string, string>;
    bg: Record<string, string>;
    border: Record<string, string>;
    icon: Record<string, string>;
    button: Record<string, string>;
  },
  baseColors: {
    primary: Record<number, string>;
    neutral: Record<number, string>;
    success: Record<number, string>;
    danger: Record<number, string>;
    warning: Record<number, string>;
    info: Record<number, string>;
    black: string;
    white: string;
  },
): Record<string, string> {
  // Determine if this is a dark theme by checking bg.overlay
  const isOverlayDark = theme.bg.overlay?.startsWith('#000');

  return {
    // Text colors
    '--text-primary': hexToRgb(theme.text.primary),
    '--text-secondary': hexToRgb(theme.text.secondary),
    '--text-tertiary': hexToRgb(theme.text.tertiary),
    '--text-disabled': hexToRgb(theme.text.disabled),
    '--text-inverse': hexToRgb(theme.text.inverse),
    '--text-on-color': hexToRgb(theme.text.onColor),
    '--text-success': hexToRgb(theme.text.success),
    '--text-danger': hexToRgb(theme.text.danger),
    '--text-warning': hexToRgb(theme.text.warning),
    '--text-info': hexToRgb(theme.text.info),
    '--text-brand': hexToRgb(theme.text.brand),

    // Background colors
    '--bg-primary': hexToRgb(theme.bg.primary),
    '--bg-secondary': hexToRgb(theme.bg.secondary),
    '--bg-tertiary': hexToRgb(theme.bg.tertiary),
    '--bg-quaternary': hexToRgb(theme.bg.quaternary),
    '--bg-inverse': hexToRgb(theme.bg.inverse),
    '--bg-brand': hexToRgb(theme.bg.brand),
    '--bg-success': hexToRgb(theme.bg.success),
    '--bg-danger': hexToRgb(theme.bg.danger),
    '--bg-warning': hexToRgb(theme.bg.warning),
    '--bg-info': hexToRgb(theme.bg.info),
    '--bg-brand-muted': hexToRgb(baseColors.primary[500]),
    '--bg-secondary-muted': hexToRgb(baseColors.neutral[500]),
    '--bg-success-muted': hexToRgb(baseColors.success[500]),
    '--bg-danger-muted': hexToRgb(baseColors.danger[500]),
    '--bg-warning-muted': hexToRgb(baseColors.warning[500]),
    '--bg-info-muted': hexToRgb(baseColors.info[500]),
    '--bg-overlay': hexToRgb(isOverlayDark ? baseColors.black : baseColors.white),

    // Border colors
    '--border-primary': hexToRgb(theme.border.primary),
    '--border-secondary': hexToRgb(theme.border.secondary),
    '--border-tertiary': hexToRgb(theme.border.tertiary),
    '--border-inverse': hexToRgb(theme.border.inverse),
    '--border-brand': hexToRgb(theme.border.brand),
    '--border-success': hexToRgb(theme.border.success),
    '--border-danger': hexToRgb(theme.border.danger),
    '--border-warning': hexToRgb(theme.border.warning),
    '--border-info': hexToRgb(theme.border.info),
    '--border-brand-muted': hexToRgb(baseColors.primary[500]),
    '--border-secondary-muted': hexToRgb(baseColors.neutral[500]),
    '--border-success-muted': hexToRgb(baseColors.success[500]),
    '--border-danger-muted': hexToRgb(baseColors.danger[500]),
    '--border-warning-muted': hexToRgb(baseColors.warning[500]),
    '--border-info-muted': hexToRgb(baseColors.info[500]),

    // Icon colors
    '--icon-primary': hexToRgb(theme.icon.primary),
    '--icon-secondary': hexToRgb(theme.icon.secondary),
    '--icon-tertiary': hexToRgb(theme.icon.tertiary),
    '--icon-disabled': hexToRgb(theme.icon.disabled),
    '--icon-inverse': hexToRgb(theme.icon.inverse),
    '--icon-on-color': hexToRgb(theme.icon.onColor),
    '--icon-success': hexToRgb(theme.icon.success),
    '--icon-danger': hexToRgb(theme.icon.danger),
    '--icon-warning': hexToRgb(theme.icon.warning),
    '--icon-info': hexToRgb(theme.icon.info),
    '--icon-brand': hexToRgb(theme.icon.brand),

    // Button colors
    '--button-primary': hexToRgb(theme.button.primary),
    '--button-primary-hover': hexToRgb(theme.button.primaryHover),
    '--button-primary-active': hexToRgb(theme.button.primaryActive),
    '--button-secondary': hexToRgb(theme.button.secondary),
    '--button-secondary-hover': hexToRgb(theme.button.secondaryHover),
    '--button-secondary-active': hexToRgb(theme.button.secondaryActive),
    '--button-outline-hover': hexToRgb(theme.button.outlineHover),
    '--button-outline-active': hexToRgb(theme.button.outlineActive),
    '--button-danger': hexToRgb(theme.button.danger),
    '--button-danger-hover': hexToRgb(theme.button.dangerHover),
    '--button-danger-active': hexToRgb(theme.button.dangerActive),
    '--button-success': hexToRgb(theme.button.success),
    '--button-success-hover': hexToRgb(theme.button.successHover),
    '--button-success-active': hexToRgb(theme.button.successActive),
    '--button-disabled': hexToRgb(theme.button.disabled),
  };
}
