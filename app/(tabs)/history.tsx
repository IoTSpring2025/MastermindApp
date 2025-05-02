import React, { useEffect, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { historyStyle } from '@/app/styles/historyStyle';
import { Game } from '@/app/types/game';

export default function HistoryScreen() {
  const { user, loading } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return;

      try {
        const gamesRef = collection(firestore, 'games');
        const q = query(gamesRef, where('players', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        
        const gamesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Game[];

        setGames(gamesData);
        setError(null);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load game history');
        Alert.alert(
          'Error',
          'Unable to load game history. Please check your connection and try again.',
          [{ text: 'OK' }]
        );
      }
    };

    fetchGames();
  }, [user]);

  if (loading) {
    return (
      <ThemedView style={historyStyle.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={historyStyle.container}>
        <ThemedText>Please sign in to view your game history</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={historyStyle.container}>
      <ThemedView style={historyStyle.header}>
        <ThemedText type="title">Game History</ThemedText>
      </ThemedView>

      {error ? (
        <ThemedText style={{ textAlign: 'center', padding: 20 }}>
          {error}
        </ThemedText>
      ) : games.length === 0 ? (
        <ThemedText style={{ textAlign: 'center', padding: 20 }}>
          No games played yet
        </ThemedText>
      ) : (
        games.map((game) => (
          <ThemedView key={game.id} style={historyStyle.gameCard}>
            <ThemedView style={historyStyle.gameHeader}>
              <ThemedText type="subtitle">Game {game.id}</ThemedText>
              <ThemedText style={historyStyle.result}>
                {game.win ? 'Win' : 'Loss'}
              </ThemedText>
            </ThemedView>

            <ThemedView style={historyStyle.gameDetails}>
              <ThemedText style={historyStyle.label}>Your Hand:</ThemedText>
              <ThemedText>
                {game.playerHand?.value ? game.playerHand.value.join(', ') : 'N/A'}
              </ThemedText>

              <ThemedText style={historyStyle.label}>Flop:</ThemedText>
              <ThemedText>{game.flop ? game.flop.join(', ') : 'N/A'}</ThemedText>

              <ThemedText style={historyStyle.label}>Turn:</ThemedText>
              <ThemedText>{game.turn || 'N/A'}</ThemedText>

              <ThemedText style={historyStyle.label}>River:</ThemedText>
              <ThemedText>{game.river || 'N/A'}</ThemedText>
            </ThemedView>
          </ThemedView>
        ))
      )}
    </ScrollView>
  );
} 