import React, { useEffect, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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
        const q = query(
          gamesRef,
          where('player_id', '==', user.email),
          orderBy('createdAt', 'desc')
        );
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
              <ThemedText type="subtitle">
                Game {game.id.slice(0, 8)}
              </ThemedText>
              <ThemedText style={[
                historyStyle.result,
                { color: game.win ? '#4CAF50' : '#F44336' }
              ]}>
                {game.win ? 'Win' : 'Loss'}
              </ThemedText>
            </ThemedView>

            <ThemedView style={historyStyle.gameDetails}>
              <ThemedText style={historyStyle.label}>Your Hand:</ThemedText>
              <ThemedText>
                {game.playerHand?.value ? game.playerHand.value.join(', ') : 'N/A'}
              </ThemedText>

              <ThemedText style={historyStyle.label}>Community Cards:</ThemedText>
              <ThemedText>
                {game.flop ? `Flop: ${game.flop.join(', ')}` : 'N/A'}
                {game.turn ? `\nTurn: ${game.turn}` : ''}
                {game.river ? `\nRiver: ${game.river}` : ''}
              </ThemedText>

              <ThemedText style={historyStyle.label}>Advice:</ThemedText>
              <ThemedText>
                {game.advice?.flop ? `Flop: ${game.advice.flop}` : 'N/A'}
                {game.advice?.turn ? `\nTurn: ${game.advice.turn}` : ''}
                {game.advice?.river ? `\nRiver: ${game.advice.river}` : ''}
              </ThemedText>

              <ThemedText style={historyStyle.date}>
                {game.createdAt ? new Date(game.createdAt.toDate()).toLocaleString() : 'N/A'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ))
      )}
    </ScrollView>
  );
} 