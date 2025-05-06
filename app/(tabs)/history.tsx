import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { historyStyle } from '@/app/styles/historyStyle';
import { Game } from '@/app/types/game';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { user, loading } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGames = async () => {
    if (!user) return;

    try {
      setRefreshing(true);
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
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
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
        <ThemedView style={historyStyle.headerContent}>
          <ThemedText type="title">Game History</ThemedText>
          <TouchableOpacity 
            onPress={fetchGames}
            style={historyStyle.refreshButton}
            disabled={refreshing}
          >
            <Ionicons 
              name="refresh" 
              size={24} 
              color="#666666"
              style={refreshing ? historyStyle.refreshing : undefined}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {error ? (
        <ThemedView style={historyStyle.errorState}>
          <ThemedText style={{ textAlign: 'center' }}>
            {error}
          </ThemedText>
        </ThemedView>
      ) : games.length === 0 ? (
        <ThemedView style={historyStyle.emptyState}>
          <ThemedText style={{ textAlign: 'center' }}>
            No games played yet
          </ThemedText>
        </ThemedView>
      ) : (
        games.map((game) => (
          <ThemedView key={game.id} style={historyStyle.gameCard}>
            <ThemedView style={historyStyle.gameHeader}>
              <ThemedText type="subtitle">Game {game.id.slice(0, 8)}</ThemedText>
              <ThemedText style={[
                historyStyle.result,
                game.win ? historyStyle.winResult : historyStyle.lossResult
              ]}>
                {game.win ? 'Win' : 'Loss'}
              </ThemedText>
            </ThemedView>

            <ThemedView style={historyStyle.gameDetails}>
              <ThemedText style={historyStyle.label}>Your Hand:</ThemedText>
              <ThemedText style={historyStyle.cardValue}>
                {game.playerHand?.value ? game.playerHand.value.join(', ') : 'N/A'}
              </ThemedText>

              <ThemedText style={historyStyle.label}>Community Cards:</ThemedText>
              <ThemedText style={historyStyle.cardValue}>
                {game.flop ? `Flop: ${game.flop.join(', ')}` : 'N/A'}
                {game.turn ? `\nTurn: ${game.turn}` : ''}
                {game.river ? `\nRiver: ${game.river}` : ''}
              </ThemedText>

              <ThemedText style={historyStyle.label}>AI Advice:</ThemedText>
              <ThemedText style={historyStyle.cardValue}>
                {game.advice?.flop ? `Flop: ${game.advice.flop}\n` : ''}
                {game.advice?.turn ? `Turn: ${game.advice.turn}\n` : ''}
                {game.advice?.river ? `River: ${game.advice.river}` : ''}
                {!game.advice?.flop && !game.advice?.turn && !game.advice?.river ? 'No advice recorded' : ''}
              </ThemedText>

              <ThemedText style={historyStyle.date}>
                {game.createdAt ? new Date(game.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ))
      )}
    </ScrollView>
  );
} 