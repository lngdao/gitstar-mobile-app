/**
 * Font Family System
 * Values from tailwind.config.js
 */

export const fonts = {
  inter: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    extrabold: 'Inter-ExtraBold',
  },
} as const;

export type FontFamily = keyof typeof fonts;
export type FontWeight<T extends FontFamily> = keyof (typeof fonts)[T];
