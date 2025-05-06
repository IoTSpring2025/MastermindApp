import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, TouchableOpacity, Image, View } from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { historyStyle } from '@/app/styles/historyStyle';
import { Game } from '@/app/types/game';
import { Ionicons } from '@expo/vector-icons';

// Add card image mapping
const cardImages: { [key: string]: any } = {
  'AS': require('@/assets/images/AS.png'),
  '2S': require('@/assets/images/2S.png'),
  '3S': require('@/assets/images/3S.png'),
  '4S': require('@/assets/images/4S.png'),
  '5S': require('@/assets/images/5S.png'),
  '6S': require('@/assets/images/6S.png'),
  '7S': require('@/assets/images/7S.png'),
  '8S': require('@/assets/images/8S.png'),
  '9S': require('@/assets/images/9S.png'),
  '10S': require('@/assets/images/10S.png'),
  'JS': require('@/assets/images/JS.png'),
  'QS': require('@/assets/images/QS.png'),
  'KS': require('@/assets/images/KS.png'),
  'AH': require('@/assets/images/AH.png'),
  '2H': require('@/assets/images/2H.png'),
  '3H': require('@/assets/images/3H.png'),
  '4H': require('@/assets/images/4H.png'),
  '5H': require('@/assets/images/5H.png'),
  '6H': require('@/assets/images/6H.png'),
  '7H': require('@/assets/images/7H.png'),
  '8H': require('@/assets/images/8H.png'),
  '9H': require('@/assets/images/9H.png'),
  '10H': require('@/assets/images/10H.png'),
  'JH': require('@/assets/images/JH.png'),
  'QH': require('@/assets/images/QH.png'),
  'KH': require('@/assets/images/KH.png'),
  'AC': require('@/assets/images/AC.png'),
  '2C': require('@/assets/images/2C.png'),
  '3C': require('@/assets/images/3C.png'),
  '4C': require('@/assets/images/4C.png'),
  '5C': require('@/assets/images/5C.png'),
  '6C': require('@/assets/images/6C.png'),
  '7C': require('@/assets/images/7C.png'),
  '8C': require('@/assets/images/8C.png'),
  '9C': require('@/assets/images/9C.png'),
  '10C': require('@/assets/images/10C.png'),
  'JC': require('@/assets/images/JC.png'),
  'QC': require('@/assets/images/QC.png'),
  'KC': require('@/assets/images/KC.png'),
  'AD': require('@/assets/images/AD.png'),
  '2D': require('@/assets/images/2D.png'),
  '3D': require('@/assets/images/3D.png'),
  '4D': require('@/assets/images/4D.png'),
  '5D': require('@/assets/images/5D.png'),
  '6D': require('@/assets/images/6D.png'),
  '7D': require('@/assets/images/7D.png'),
  '8D': require('@/assets/images/8D.png'),
  '9D': require('@/assets/images/9D.png'),
  '10D': require('@/assets/images/10D.png'),
  'JD': require('@/assets/images/JD.png'),
  'QD': require('@/assets/images/QD.png'),
  'KD': require('@/assets/images/KD.png'),
};

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
        where('completed', '==', true),
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

  const renderCard = (cardValue: string | undefined) => {
    if (!cardValue) {
      return (
        <ThemedView style={historyStyle.card}>
          <ThemedText>Empty</ThemedText>
        </ThemedView>
      );
    }

    return (
      <Image
        source={cardImages[cardValue]}
        style={historyStyle.cardImage}
        resizeMode="contain"
      />
    );
  };

  const getAdviceColor = (advice: string) => {
    const lowerAdvice = advice.toLowerCase();
    if (lowerAdvice.includes('raise') || lowerAdvice.includes('call')) {
      return '#4CAF50'; // green
    } else if (lowerAdvice.includes('fold')) {
      return '#F44336'; // red
    } else if (lowerAdvice.includes('check')) {
      return '#FF9800'; // orange
    }
    return '#666666'; // default gray
  };

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
              <ThemedView style={historyStyle.cardsContainer}>
                {game.playerHand?.value?.map((card, index) => (
                  <ThemedView key={index} style={historyStyle.card}>
                    {renderCard(card)}
                  </ThemedView>
                ))}
              </ThemedView>

              <ThemedText style={historyStyle.label}>Community Cards:</ThemedText>
              <ThemedView style={historyStyle.cardsContainer}>
                {game.flop?.map((card, index) => (
                  <ThemedView key={`flop-${index}`} style={historyStyle.card}>
                    {renderCard(card)}
                  </ThemedView>
                ))}
                {game.turn && (
                  <ThemedView style={historyStyle.card}>
                    {renderCard(game.turn)}
                  </ThemedView>
                )}
                {game.river && (
                  <ThemedView style={historyStyle.card}>
                    {renderCard(game.river)}
                  </ThemedView>
                )}
              </ThemedView>

              <ThemedText style={historyStyle.label}>AI Advice:</ThemedText>
              <ThemedView style={historyStyle.adviceContainer}>
                {game.advice?.flop && (
                  <ThemedText style={[historyStyle.adviceText, { color: getAdviceColor(game.advice.flop) }]}>
                    <ThemedText style={{ fontWeight: 'bold', color: '#333333' }}>Flop: </ThemedText>
                    {game.advice.flop}
                  </ThemedText>
                )}
                {game.advice?.turn && (
                  <ThemedText style={[historyStyle.adviceText, { color: getAdviceColor(game.advice.turn) }]}>
                    <ThemedText style={{ fontWeight: 'bold', color: '#333333' }}>Turn: </ThemedText>
                    {game.advice.turn}
                  </ThemedText>
                )}
                {game.advice?.river && (
                  <ThemedText style={[historyStyle.adviceText, { color: getAdviceColor(game.advice.river) }]}>
                    <ThemedText style={{ fontWeight: 'bold', color: '#333333' }}>River: </ThemedText>
                    {game.advice.river}
                  </ThemedText>
                )}
              </ThemedView>

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