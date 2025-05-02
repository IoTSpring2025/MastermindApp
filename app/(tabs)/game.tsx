import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, View, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { gameStyle } from '@/app/styles/gameStyle';

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [gameData, setGameData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    if (!user) return;

    const gameRef = doc(firestore, 'games', id as string);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        setGameData(doc.data());
      } else {
        Alert.alert('Error', 'Game not found');
        router.replace('/');
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to game updates:', error);
      Alert.alert('Error', 'Failed to connect to game');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, user]);

  const handleWin = async () => {
    if (!id || !user) return;

    try {
      const gameRef = doc(firestore, 'games', id as string);
      await updateDoc(gameRef, {
        winner: user.uid,
        roundOver: true,
      });

      Alert.alert('Success', 'You won the round!');
      resetGame();
    } catch (error) {
      console.error('Error updating game:', error);
      Alert.alert('Error', 'Failed to update game');
    }
  };

  const handleLoss = async () => {
    if (!id || !user) return;

    try {
      const gameRef = doc(firestore, 'games', id as string);
      await updateDoc(gameRef, {
        winner: null,
        roundOver: true,
      });

      Alert.alert('Game Over', 'You lost the round.');
      resetGame();
    } catch (error) {
      console.error('Error updating game:', error);
      Alert.alert('Error', 'Failed to update game');
    }
  };

  const resetGame = async () => {
    if (!id || !user) return;

    try {
      const gameRef = doc(firestore, 'games', id as string);
      await updateDoc(gameRef, {
        flop: null,
        turn: null,
        river: null,
        playerHands: {},
        call: null,
        roundOver: false,
      });
    } catch (error) {
      console.error('Error resetting game:', error);
      Alert.alert('Error', 'Failed to reset game');
    }
  };

  if (loading) {
    return (
      <ThemedView style={gameStyle.container}>
        <ThemedText>Loading game...</ThemedText>
      </ThemedView>
    );
  }

  if (!id) {
    return (
      <ThemedView style={gameStyle.centeredContainer}>
        <ThemedText type="title" style={gameStyle.title}>
          Create a game first
        </ThemedText>
        <ThemedButton
          onPress={() => router.replace('/')}
          style={gameStyle.button}
          title="Back to Home"
        />
      </ThemedView>
    );
  }

  if (!gameData || !user) {
    return (
      <ThemedView style={gameStyle.container}>
        <ThemedText>Game not found or user not authenticated</ThemedText>
      </ThemedView>
    );
  }

  const { flop, turn, river, playerHands, call } = gameData;
  const playerCards = playerHands?.[user.uid] || [];

  return (
    <ThemedView style={gameStyle.container}>
      <ThemedText type="title" style={gameStyle.title}>
        Game Room: {id}
      </ThemedText>

      {/* Poker Table */}
      <ThemedView style={gameStyle.table}>
        {/* Community Cards */}
        <ThemedView style={gameStyle.communityCards}>
          {flop && flop.map((card: string, index: number) => (
            <ThemedView key={index} style={gameStyle.card}>
              <ThemedText>{card}</ThemedText>
            </ThemedView>
          ))}
          {turn && (
            <ThemedView style={gameStyle.card}>
              <ThemedText>{turn}</ThemedText>
            </ThemedView>
          )}
          {river && (
            <ThemedView style={gameStyle.card}>
              <ThemedText>{river}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>

      {/* Player's Hand */}
      <ThemedView style={gameStyle.handContainer}>
        <ThemedText type="subtitle">Your Hand</ThemedText>
        <ThemedView style={gameStyle.hand}>
          {playerCards.map((card: string, index: number) => (
            <ThemedView key={index} style={gameStyle.card}>
              <ThemedText>{card}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Action Status */}
      <ThemedView style={gameStyle.actionContainer}>
        <ThemedText type="subtitle">
          Action: {call || 'Waiting...'}
        </ThemedText>
      </ThemedView>

      {/* Win/Loss Buttons */}
      <ThemedView style={gameStyle.buttonContainer}>
        <ThemedButton
          onPress={handleWin}
          style={[gameStyle.button, gameStyle.winButton]}
          title="Win"
        />
        <ThemedButton
          onPress={handleLoss}
          style={[gameStyle.button, gameStyle.lossButton]}
          title="Loss"
        />
      </ThemedView>
    </ThemedView>
  );
} 