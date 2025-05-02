import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { componentStyle } from '@/app/styles/componentStyle';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? componentStyle.default : undefined,
        type === 'title' ? componentStyle.title : undefined,
        type === 'defaultSemiBold' ? componentStyle.defaultSemiBold : undefined,
        type === 'subtitle' ? componentStyle.subtitle : undefined,
        type === 'link' ? componentStyle.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
