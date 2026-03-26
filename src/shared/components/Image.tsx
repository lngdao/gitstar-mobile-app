import React from 'react';
import FastImage, { FastImageProps, Source } from '@d11/react-native-fast-image';
import {
  StyleProp,
  ImageStyle,
  DimensionValue,
  ImageRequireSource,
} from 'react-native';

// Shared custom props
interface CustomImageProps {
  /**
   * Width of the image
   */
  width?: DimensionValue;
  /**
   * Height of the image
   */
  height?: DimensionValue;
  /**
   * Border radius (boolean or number)
   */
  rounded?: boolean | number;
  /**
   * Custom style
   */
  style?: StyleProp<ImageStyle>;
}

// Props for Image component
export interface ImageProps
  extends Omit<FastImageProps, 'source' | 'style' | 'width' | 'height' | 'resizeMode'>,
    CustomImageProps {
  /**
   * Image source - URL string, Source object, or local asset (require())
   */
  source: string | Source | ImageRequireSource;
  /**
   * Resize mode for the image
   */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

/**
 * Convert resizeMode string to FastImage ResizeMode
 */
const getFastImageResizeMode = (
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center',
): 'contain' | 'cover' | 'stretch' | 'center' => {
  if (!resizeMode) return 'cover';
  return resizeMode;
};

/**
 * Convert source to FastImage format
 */
const getFastImageSource = (
  source: string | Source | ImageRequireSource,
): Source | ImageRequireSource => {
  // If string, convert to Source object
  if (typeof source === 'string') {
    return { uri: source, priority: 'high' };
  }
  // If already Source object or ImageRequireSource, return as is
  return source;
};

/**
 * Image Component
 * Wrapper around react-native-fast-image for both local and remote images
 *
 * @example
 * ```tsx
 * // URL image
 * <Image
 *   source="https://example.com/image.jpg"
 *   width={200}
 *   height={200}
 *   rounded={8}
 * />
 *
 * // URL image with Source object
 * <Image
 *   source={{ uri: "https://example.com/image.jpg", priority: FastImage.priority.high }}
 *   width={200}
 *   height={200}
 * />
 *
 * // Local image
 * <Image
 *   source={require('./assets/icon.png')}
 *   width={100}
 *   height={100}
 * />
 * ```
 */
export const Image: React.FC<ImageProps> = ({
  source,
  width,
  height,
  rounded,
  style,
  resizeMode,
  ...rest
}) => {
  const imageStyle: StyleProp<ImageStyle> = React.useMemo(
    () => [
      width !== undefined && { width },
      height !== undefined && { height },
      typeof rounded === 'number' && { borderRadius: rounded },
      typeof rounded === 'boolean' && rounded && { borderRadius: 9999 },
      style,
    ],
    [width, height, rounded, style],
  );

  const imageSource = React.useMemo(() => getFastImageSource(source), [source]);

  return (
    <FastImage
      source={imageSource}
      style={imageStyle as any}
      resizeMode={getFastImageResizeMode(resizeMode)}
      transition='fade'
      {...(rest as any)}
    />
  );
};
