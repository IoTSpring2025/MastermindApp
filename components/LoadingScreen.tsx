import React from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { loadingStyle } from '@/app/styles/loadingStyle';

export function LoadingScreen() {
  return (
    <ThemedView style={loadingStyle.container}>
      <ActivityIndicator size="large" color="#4285F4" />
      <ThemedText style={loadingStyle.text}>Loading...</ThemedText>
    </ThemedView>
  );
} 