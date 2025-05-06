import React, { useState } from 'react';
import { TextInput, Alert, Platform, Linking, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { homeStyle } from '@/app/styles/homeStyle';

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const handleCreateGame = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to create a game');
      router.replace('/(auth)/auth');
      return;
    }

    setIsCreating(true);
    try {
      const gameRef = await addDoc(collection(firestore, 'games'), {
        player_id: user.email,
        createdAt: new Date(),
        status: 'waiting',
        hand: [],
        gameId: user.uid + new Date().getTime(),
        advice: {
          flop: '',
          turn: '',
          river: ''
        },
        flop: [],
        turn: '',
        river: ''
      });

      router.push(`/game?id=${gameRef.id}`);
    } catch (error: any) {
      console.error('Error creating game:', error);
      let errorMessage = 'Failed to create game. Please check your connection and try again.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Insufficient permissions. Please make sure you are signed in with a valid email.';
      }
      
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsCreating(false);
    }
  };

  const handleGameResult = async (won: boolean) => {
    if (!currentGameId) return;

    try {
      const gameRef = doc(firestore, 'games', currentGameId);
      await updateDoc(gameRef, {
        win: won
      });
      Alert.alert('Success', won ? 'Game marked as won!' : 'Game marked as lost.');
    } catch (error) {
      console.error('Error updating game result:', error);
      Alert.alert('Error', 'Failed to update game result.');
    }
  };

  const handleEndGame = () => {
    setCurrentGameId(null);
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
    <ThemedView style={[homeStyle.container, { paddingTop: Platform.OS === 'ios' ? 80 : 20 }]}>
      <ThemedText type="title" style={[homeStyle.title, { fontSize: 24 }]}>
        Mastermind: Your AI Poker Coach
      </ThemedText>

      {!currentGameId ? (
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
      ) : (
        <ThemedView style={styles.gameContainer}>
          <ThemedText style={styles.gameId}>Game ID: {currentGameId.substring(0, 6)}</ThemedText>
          
          {/* Community Cards - Top Row (5 cards) */}
          <ThemedView style={styles.communityCards}>
            <ThemedView style={styles.cardPlaceholder} />
            <ThemedView style={styles.cardPlaceholder} />
            <ThemedView style={styles.cardPlaceholder} />
            <ThemedView style={styles.cardPlaceholder} />
            <ThemedView style={styles.cardPlaceholder} />
          </ThemedView>

          {/* Player's Hand - Bottom Row (2 cards) */}
          <ThemedView style={styles.cardsContainer}>
            <ThemedView style={styles.cardPlaceholder} />
            <ThemedView style={styles.cardPlaceholder} />
          </ThemedView>

          {/* Game Controls */}
          <ThemedView style={styles.controlsContainer}>
            <ThemedButton
              onPress={() => handleGameResult(true)}
              style={[styles.controlButton, styles.winButton]}
              title="Win"
            />
            <ThemedButton
              onPress={() => handleGameResult(false)}
              style={[styles.controlButton, styles.loseButton]}
              title="Lose"
            />
          </ThemedView>

          <ThemedButton
            onPress={handleEndGame}
            style={[styles.controlButton, styles.endButton]}
            title="End Game"
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  gameId: {
    fontSize: 18,
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  communityCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardPlaceholder: {
    width: 50,
    height: 75,
    backgroundColor: '#2a2a2a',
    margin: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  controlButton: {
    marginHorizontal: 10,
    minWidth: 100,
  },
  winButton: {
    backgroundColor: '#4CAF50',
  },
  loseButton: {
    backgroundColor: '#f44336',
  },
  endButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
});