import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/authContext';
import { getPokerAdvice, PokerAdviceResponse } from '@/app/lib/chatgpt';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { gameStyle } from '@/app/styles/gameStyle';

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [gameData, setGameData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<PokerAdviceResponse | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [lastGameStage, setLastGameStage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    if (!user) return;

    const gameRef = doc(firestore, 'games', id as string);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setGameData(data);
        
        // Check if game is completed
        if (data.completed) {
          setGameData(null); // Clear game data to show create game message
        }
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

  // Determine the current game stage
  const determineGameStage = useCallback(() => {
    if (!gameData) return null;
    
    const { flop, turn, river, playerHands } = gameData;
    const playerCards = playerHands?.[user?.uid || ''] || [];
    
    if (playerCards.length > 0 && !flop) return 'pre-flop';
    if (flop && !turn) return 'flop';
    if (turn && !river) return 'turn';
    if (river) return 'river';
    return null;
  }, [gameData, user]);

  // Get ChatGPT advice when the game stage changes
  useEffect(() => {
    const currentStage = determineGameStage();
    if (currentStage && currentStage !== lastGameStage && user) {
      setLastGameStage(currentStage);
      fetchPokerAdvice(currentStage);
    }
  }, [gameData, lastGameStage, determineGameStage, user]);

  const fetchPokerAdvice = async (gameStage: string) => {
    if (!gameData || !user) return;

    const { flop, turn, river, playerHands } = gameData;
    const playerCards = playerHands?.[user.uid] || [];
    
    // Don't fetch advice if we don't have player cards
    if (!playerCards.length) return;
    
    // Prepare community cards based on game stage
    let communityCards: string[] = [];
    if (flop) communityCards = [...flop];
    if (turn) communityCards.push(turn);
    if (river) communityCards.push(river);
    
    setIsLoadingAdvice(true);
    try {
      const adviceResponse = await getPokerAdvice(
        playerCards,
        communityCards,
        gameStage as 'pre-flop' | 'flop' | 'turn' | 'river'
      );
      setAdvice(adviceResponse);
    } catch (error) {
      console.error('Error fetching poker advice:', error);
      setAdvice({
        advice: 'Unable to get advice at this time.',
        recommendation: 'unknown',
        confidence: 0,
        reasoning: 'There was an error connecting to the AI advisor.'
      });
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const handleWin = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const gameRef = doc(firestore, 'games', id as string);
      await updateDoc(gameRef, {
        win: true,
        completed: true,
        roundOver: true,
        winner: user?.uid
      });
      Alert.alert('Success', 'Game marked as won!');
      router.push('/(tabs)/history');
    } catch (error) {
      console.error('Error updating game:', error);
      Alert.alert('Error', 'Failed to update game result');
    } finally {
      setLoading(false);
    }
  };

  const handleLoss = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const gameRef = doc(firestore, 'games', id as string);
      await updateDoc(gameRef, {
        win: false,
        completed: true,
        roundOver: true,
        winner: null
      });
      Alert.alert('Success', 'Game marked as lost');
      router.push('/(tabs)/history');
    } catch (error) {
      console.error('Error updating game:', error);
      Alert.alert('Error', 'Failed to update game result');
    } finally {
      setLoading(false);
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
      
      // Reset advice when game is reset
      setAdvice(null);
      setLastGameStage(null);
    } catch (error) {
      console.error('Error resetting game:', error);
      Alert.alert('Error', 'Failed to reset game');
    }
  };

  // Function to get color based on recommendation
  const getRecommendationColor = (recommendation: string) => {
    switch(recommendation) {
      case 'fold': return '#ff6b6b'; // red
      case 'check': return '#ffe066'; // yellow
      case 'call': return '#63c5da'; // blue
      case 'raise': return '#4ecb71'; // green
      case 'all-in': return '#9775fa'; // purple
      default: return '#a0a0a0'; // gray
    }
  };

  // Render the AI advice component
  const renderAdvice = () => {
    if (!advice) return null;
    
    const recommendationColor = getRecommendationColor(advice.recommendation);
    
    return (
      <ThemedView style={gameStyle.adviceContainer}>
        <ThemedText type="subtitle">AI Advisor</ThemedText>
        {isLoadingAdvice ? (
          <View style={gameStyle.loadingContainer}>
            <ActivityIndicator size="small" color="#4285F4" />
            <ThemedText style={{marginLeft: 8}}>Getting advice...</ThemedText>
          </View>
        ) : (
          <>
            <ThemedView style={[gameStyle.recommendationBadge, {backgroundColor: recommendationColor}]}>
              <ThemedText style={gameStyle.recommendationText}>
                {advice.recommendation.toUpperCase()}
              </ThemedText>
            </ThemedView>
            <ThemedText style={gameStyle.adviceText}>{advice.advice}</ThemedText>
            <ThemedText style={gameStyle.reasoningText}>{advice.reasoning}</ThemedText>
            <ThemedView style={gameStyle.confidenceBar}>
              <ThemedView 
                style={[
                  gameStyle.confidenceFill, 
                  {width: `${advice.confidence}%`, backgroundColor: recommendationColor}
                ]} 
              />
              <ThemedText style={gameStyle.confidenceText}>
                {advice.confidence}% confidence
              </ThemedText>
            </ThemedView>
          </>
        )}
      </ThemedView>
    );
  };

  if (loading) {
    return (
      <ThemedView style={gameStyle.container}>
        <ThemedText>Loading game...</ThemedText>
      </ThemedView>
    );
  }

  if (!id || !gameData || !user) {
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

  const { flop, turn, river, playerHands, call } = gameData;
  const playerCards = playerHands?.[user.uid] || [];
  const currentStage = determineGameStage();

  const getPlaceholderAdvice = (cards: string[]) => {
    if (cards.length !== 2) return '';
    
    // Simple placeholder advice based on card values
    const [card1, card2] = cards;
    const value1 = card1.charAt(0);
    const value2 = card2.charAt(0);
    const sameSuit = card1.charAt(1) === card2.charAt(1);
    
    if (value1 === value2) {
      return "Pocket pair - Consider raising pre-flop";
    } else if (sameSuit) {
      return "Suited cards - Playable if connected";
    } else if (['A', 'K', 'Q'].includes(value1) && ['A', 'K', 'Q'].includes(value2)) {
      return "Broadway cards - Strong starting hand";
    } else {
      return "Consider position and stack size";
    }
  };

  return (
    <ThemedView style={gameStyle.container}>
      <ThemedText type="title" style={gameStyle.title}>
        Game Room: {id}
      </ThemedText>

      {/* Poker Table */}
      <ThemedView style={gameStyle.table}>
        {/* Community Cards */}
        <ThemedView style={gameStyle.communityCards}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <ThemedView key={index} style={gameStyle.card}>
              <ThemedText>{flop?.[index] || turn || river || ""}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Player's Hand */}
      <ThemedView style={gameStyle.handContainer}>
        <ThemedText type="subtitle">Your Hand</ThemedText>
        <ThemedView style={gameStyle.hand}>
          {[1, 2].map((_, index) => (
            <ThemedView key={index} style={gameStyle.card}>
              <ThemedText>{playerCards[index] || ""}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
        <ThemedView style={gameStyle.placeholderAdvice}>
          <ThemedText style={gameStyle.placeholderAdviceText}>
            {playerCards.length > 0 ? getPlaceholderAdvice(playerCards) : "No game state detected yet. Deal cards to begin."}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Game Stage */}
      {currentStage && (
        <ThemedView style={gameStyle.stageContainer}>
          <ThemedText type="subtitle">
            Stage: {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}
          </ThemedText>
        </ThemedView>
      )}

      {/* Action Status */}
      <ThemedView style={gameStyle.actionContainer}>
        <ThemedText type="subtitle">
          Action: {call || 'Waiting...'}
        </ThemedText>
      </ThemedView>

      {/* AI Advice */}
      {renderAdvice()}

      {/* Get Advice Button */}
      {playerCards.length > 0 && currentStage && (
        <ThemedButton
          onPress={() => fetchPokerAdvice(currentStage)}
          style={gameStyle.adviceButton}
          title={isLoadingAdvice ? "Getting advice..." : "Get AI Advice"}
          disabled={isLoadingAdvice}
        />
      )}

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