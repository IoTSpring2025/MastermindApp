import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { componentStyle } from '@/app/styles/componentStyle';

interface ThemedButtonProps {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
}

export function ThemedButton({ 
  onPress, 
  title, 
  style, 
  variant = 'primary',
  disabled = false 
}: ThemedButtonProps) {
  const getButtonStyle = () => {
    const styles = [componentStyle.button];
    
    if (disabled) {
      styles.push(componentStyle.buttonDisabled);
    } else {
      switch (variant) {
        case 'secondary':
          styles.push(componentStyle.buttonSecondary);
          break;
        case 'danger':
          styles.push(componentStyle.buttonDanger);
          break;
        case 'success':
          styles.push(componentStyle.buttonSuccess);
          break;
      }
    }
    
    return styles;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <ThemedText style={componentStyle.buttonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
} 