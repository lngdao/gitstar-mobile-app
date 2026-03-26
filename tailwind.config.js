/** @type {import('tailwindcss').Config} */

const { darkThemeVars } = require('./src/shared/theme/theme-dark.ts');
const { lightThemeVars } = require('./src/shared/theme/theme-light.ts');
const { colors } = require('./src/shared/theme/colors.ts');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Design Tokens (CSS Variables) - auto-switch light/dark
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--text-tertiary) / <alpha-value>)',
          disabled: 'rgb(var(--text-disabled) / <alpha-value>)',
          inverse: 'rgb(var(--text-inverse) / <alpha-value>)',
          'on-color': 'rgb(var(--text-on-color) / <alpha-value>)',
          success: 'rgb(var(--text-success) / <alpha-value>)',
          danger: 'rgb(var(--text-danger) / <alpha-value>)',
          warning: 'rgb(var(--text-warning) / <alpha-value>)',
          info: 'rgb(var(--text-info) / <alpha-value>)',
          brand: 'rgb(var(--text-brand) / <alpha-value>)',
        },
        bg: {
          primary: 'rgb(var(--bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--bg-tertiary) / <alpha-value>)',
          quaternary: 'rgb(var(--bg-quaternary) / <alpha-value>)',
          inverse: 'rgb(var(--bg-inverse) / <alpha-value>)',
          brand: 'rgb(var(--bg-brand) / <alpha-value>)',
          success: 'rgb(var(--bg-success) / <alpha-value>)',
          danger: 'rgb(var(--bg-danger) / <alpha-value>)',
          warning: 'rgb(var(--bg-warning) / <alpha-value>)',
          info: 'rgb(var(--bg-info) / <alpha-value>)',
          'brand-muted': 'rgb(var(--bg-brand-muted) / <alpha-value>)',
          'secondary-muted': 'rgb(var(--bg-secondary-muted) / <alpha-value>)',
          'success-muted': 'rgb(var(--bg-success-muted) / <alpha-value>)',
          'danger-muted': 'rgb(var(--bg-danger-muted) / <alpha-value>)',
          'warning-muted': 'rgb(var(--bg-warning-muted) / <alpha-value>)',
          'info-muted': 'rgb(var(--bg-info-muted) / <alpha-value>)',
          overlay: 'rgb(var(--bg-overlay) / <alpha-value>)',
        },
        border: {
          primary: 'rgb(var(--border-primary) / <alpha-value>)',
          secondary: 'rgb(var(--border-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--border-tertiary) / <alpha-value>)',
          inverse: 'rgb(var(--border-inverse) / <alpha-value>)',
          brand: 'rgb(var(--border-brand) / <alpha-value>)',
          success: 'rgb(var(--border-success) / <alpha-value>)',
          danger: 'rgb(var(--border-danger) / <alpha-value>)',
          warning: 'rgb(var(--border-warning) / <alpha-value>)',
          info: 'rgb(var(--border-info) / <alpha-value>)',
        },
        icon: {
          primary: 'rgb(var(--icon-primary) / <alpha-value>)',
          secondary: 'rgb(var(--icon-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--icon-tertiary) / <alpha-value>)',
          disabled: 'rgb(var(--icon-disabled) / <alpha-value>)',
          inverse: 'rgb(var(--icon-inverse) / <alpha-value>)',
          'on-color': 'rgb(var(--icon-on-color) / <alpha-value>)',
          success: 'rgb(var(--icon-success) / <alpha-value>)',
          danger: 'rgb(var(--icon-danger) / <alpha-value>)',
          warning: 'rgb(var(--icon-warning) / <alpha-value>)',
          info: 'rgb(var(--icon-info) / <alpha-value>)',
          brand: 'rgb(var(--icon-brand) / <alpha-value>)',
        },
        button: {
          primary: 'rgb(var(--button-primary) / <alpha-value>)',
          'primary-hover': 'rgb(var(--button-primary-hover) / <alpha-value>)',
          'primary-active': 'rgb(var(--button-primary-active) / <alpha-value>)',
          secondary: 'rgb(var(--button-secondary) / <alpha-value>)',
          'secondary-hover': 'rgb(var(--button-secondary-hover) / <alpha-value>)',
          'secondary-active': 'rgb(var(--button-secondary-active) / <alpha-value>)',
          danger: 'rgb(var(--button-danger) / <alpha-value>)',
          'danger-hover': 'rgb(var(--button-danger-hover) / <alpha-value>)',
          'danger-active': 'rgb(var(--button-danger-active) / <alpha-value>)',
          disabled: 'rgb(var(--button-disabled) / <alpha-value>)',
        },

        // Base colors (static)
        white: colors.white,
        black: colors.black,
        transparent: colors.transparent,
        neutral: colors.neutral,
        primary: colors.primary,
        success: colors.success,
        danger: colors.danger,
        info: colors.info,
        warning: colors.warning,
      },
      spacing: {
        0: '0px', 2: '2px', 4: '4px', 6: '6px', 8: '8px',
        10: '10px', 12: '12px', 16: '16px', 20: '20px', 24: '24px',
        32: '32px', 40: '40px', 48: '48px', 52: '52px', 56: '56px', 64: '64px',
      },
      borderRadius: {
        none: '0px', xs: '2px', sm: '4px', md: '6px', lg: '8px',
        xl: '10px', '2xl': '12px', '3xl': '16px', full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.05)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.2)',
      },
      fontSize: {
        'display-lg': '57px', 'display-md': '45px', 'display-sm': '36px',
        'headline-lg': '32px', 'headline-md': '28px', 'headline-sm': '24px',
        'title-lg': '22px', 'title-md': '16px', 'title-sm': '14px',
        'body-lg': '16px', 'body-md': '14px', 'body-sm': '12px',
        'label-lg': '14px', 'label-md': '12px', 'label-sm': '11px',
      },
      fontFamily: {
        'inter-regular': ['Inter-Regular'],
        'inter-medium': ['Inter-Medium'],
        'inter-semibold': ['Inter-SemiBold'],
        'inter-bold': ['Inter-Bold'],
        'inter-extrabold': ['Inter-ExtraBold'],
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ':root': lightThemeVars,
        '.dark': darkThemeVars,
      });
    },
  ],
};
