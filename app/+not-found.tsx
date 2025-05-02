import React from 'react';
import { Link, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { notFoundStyle } from '@/app/styles/notFoundStyle';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={notFoundStyle.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={notFoundStyle.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
