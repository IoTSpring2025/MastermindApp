import React, { useState } from 'react';
import { TextInput, Alert, Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { homeStyle } from '@/app/styles/homeStyle';

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGame = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to create a game');
      router.replace('/(auth)/auth');
      return;
    }

    setIsCreating(true);
    try {
      const gameRef = await addDoc(collection(firestore, 'games'), {
        players: [user.uid],
        createdAt: new Date(),
        status: 'waiting',
        playerHand: {
          key: user.uid,
          value: []
        },
        gameId: user.uid + new Date().getTime()
      });

      router.push(`/game?id=${gameRef.id}`);
    } catch (error: any) {
      console.error('Error creating game:', error);
      let errorMessage = 'Failed to create game. Please check your connection and try again.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Insufficient permissions.';
      }
      
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsCreating(false);
    }
  };

  const handleConnectCamera = async () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Connect to Camera',
        'Please enable Bluetooth in your device settings to connect to the camera.',
        [
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openURL('app-settings:');
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      Alert.alert(
        'Connect to Camera',
        'Please enable Bluetooth to connect to the camera.',
        [
          {
            text: 'Enable Bluetooth',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <ThemedView style={homeStyle.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={homeStyle.container}>
        <ThemedText type="title" style={homeStyle.title}>
          Mastermind: Your AI Poker Coach
        </ThemedText>
        <ThemedButton
          onPress={() => router.replace('/(auth)/auth')}
          style={homeStyle.button}
          title="Sign In to Play"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={homeStyle.container}>
      <ThemedText type="title" style={homeStyle.title}>
        Mastermind: Your AI Poker Coach
      </ThemedText>

      <ThemedView style={homeStyle.buttonContainer}>
        <ThemedButton
          onPress={handleCreateGame}
          style={homeStyle.button}
          title={isCreating ? "Creating..." : "Create Game"}
          disabled={isCreating}
        />

        <ThemedButton
          onPress={handleConnectCamera}
          style={[homeStyle.button, homeStyle.cameraButton]}
          title="Connect to Camera"
        />
      </ThemedView>
    </ThemedView>
  );
}