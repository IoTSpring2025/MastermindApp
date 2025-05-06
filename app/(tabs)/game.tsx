import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Alert, View, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ref, onValue, set } from 'firebase/database';
import { database } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/authContext';
import { getPokerAdvice, PokerAdviceResponse } from '@/app/lib/chatgpt';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { gameStyle } from '@/app/styles/gameStyle';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';

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

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [gameData, setGameData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<PokerAdviceResponse | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [lastGameStage, setLastGameStage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Clear all endpoints when a new game is started
    const clearGameState = async () => {
      await set(ref(database, 'hand'), "");
      await set(ref(database, 'flop'), "");
      await set(ref(database, 'turn'), "");
      await set(ref(database, 'river'), "");
    };
    clearGameState();

    // Listen to the new flat structure
    const handRef = ref(database, 'hand');
    const flopRef = ref(database, 'flop');
    const turnRef = ref(database, 'turn');
    const riverRef = ref(database, 'river');

    const handListener = onValue(handRef, (snapshot) => {
      const handVal = snapshot.val() || [];
      console.log('RealtimeDB hand value:', handVal);
      setGameData((prev: any) => {
        const updated = { ...prev, hand: handVal };
        console.log('Setting gameData.hand:', updated.hand);
        console.log('Updated gameData after hand:', updated);
        return updated;
      });
    });
    const flopListener = onValue(flopRef, (snapshot) => {
      const flopVal = snapshot.val() || [];
      console.log('RealtimeDB flop value:', flopVal);
      setGameData((prev: any) => {
        const updated = { ...prev, flop: flopVal };
        console.log('Setting gameData.flop:', updated.flop);
        console.log('Updated gameData after flop:', updated);
        return updated;
      });
    });
    const turnListener = onValue(turnRef, (snapshot) => {
      setGameData((prev: any) => ({ ...prev, turn: snapshot.val() || null }));
    });
    const riverListener = onValue(riverRef, (snapshot) => {
      setGameData((prev: any) => ({ ...prev, river: snapshot.val() || null }));
    });

    setLoading(false);
    return () => {
      handListener();
      flopListener();
      turnListener();
      riverListener();
    };
  }, [user]);

  // Determine the current game stage
  const determineGameStage = useCallback(() => {
    if (!gameData) return null;
    const { hand, flop, turn, river } = gameData;
    // Preflop: hand present, no community cards
    if (hand && hand.length === 2 && (!flop || flop.length === 0)) return 'preflop';
    // Flop: 3 community cards
    if (flop && flop.length === 3 && !turn && !river) return 'flop';
    // Turn: 3 flop + 1 turn
    if (flop && flop.length === 3 && turn && !river) return 'turn';
    // River: 3 flop + 1 turn + 1 river
    if (flop && flop.length === 3 && turn && river) return 'river';
    return null;
  }, [gameData]);

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

    const { hand, flop, turn, river } = gameData;
    // Only give advice if we have exactly 2 player cards
    if (!hand || hand.length !== 2 || !hand[0] || !hand[1]) return;

    // Prepare community cards based on game stage
    let communityCards: string[] = [];
    if (flop) communityCards = [...flop];
    if (turn) communityCards.push(turn);
    if (river) communityCards.push(river);

    setIsLoadingAdvice(true);
    try {
      const adviceResponse = await getPokerAdvice(
        hand,
        communityCards,
        gameStage as 'pre-flop' | 'flop' | 'turn' | 'river'
      );
      setAdvice(adviceResponse);
    } catch (error) {
      console.error('Error fetching poker advice:', error);
      setAdvice({
        advice: 'Not able to connect to assistant at this time.',
        recommendation: 'unknown',
        confidence: 0,
        reasoning: 'Unable to connect to the AI advisor.'
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
      const currentStage = determineGameStage();
      // Get existing advice to merge
      let existingAdvice = {};
      try {
        const gameSnap = await getDoc(gameRef);
        if (gameSnap.exists() && gameSnap.data().advice) {
          existingAdvice = gameSnap.data().advice;
        }
      } catch (e) { /* ignore */ }
      await updateDoc(gameRef, {
        win: true,
        completed: true,
        roundOver: true,
        winner: user?.uid,
        // Save current card values
        flop: gameData.flop || [],
        turn: gameData.turn || '',
        river: gameData.river || '',
        playerHand: {
          key: 'hand',
          value: gameData.hand || []
        },
        // Merge advice for all stages
        advice: {
          ...existingAdvice,
          [currentStage || 'preflop']: advice?.recommendation || ''
        }
      });

      // Clear real-time database values
      await set(ref(database, 'flop'), "");
      await set(ref(database, 'turn'), "");
      await set(ref(database, 'river'), "");
      await set(ref(database, 'hand'), "");
      await set(ref(database, 'hands'), "");
      await set(ref(database, 'game_over'), true);
      setAdvice(null); // Clear old AI advice after game ends

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
      const currentStage = determineGameStage();
      // Get existing advice to merge
      let existingAdvice = {};
      try {
        const gameSnap = await getDoc(gameRef);
        if (gameSnap.exists() && gameSnap.data().advice) {
          existingAdvice = gameSnap.data().advice;
        }
      } catch (e) { /* ignore */ }
      await updateDoc(gameRef, {
        win: false,
        completed: true,
        roundOver: true,
        winner: null,
        // Save current card values
        flop: gameData.flop || [],
        turn: gameData.turn || '',
        river: gameData.river || '',
        playerHand: {
          key: 'hand',
          value: gameData.hand || []
        },
        // Merge advice for all stages
        advice: {
          ...existingAdvice,
          [currentStage || 'preflop']: advice?.recommendation || ''
        }
      });

      // Clear real-time database values
      await set(ref(database, 'flop'), "");
      await set(ref(database, 'turn'), "");
      await set(ref(database, 'river'), "");
      await set(ref(database, 'hand'), "");
      await set(ref(database, 'hands'), "");
      await set(ref(database, 'game_over'), true);
      setAdvice(null); // Clear old AI advice after game ends

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
    try {
      // Reset all fields in the flat structure
      await set(ref(database, 'hand'), "");
      await set(ref(database, 'flop'), "");
      await set(ref(database, 'turn'), "");
      await set(ref(database, 'river'), "");
      setGameData({
        flop: null,
        turn: null,
        river: null,
        hand: null,
        call: null,
        completed: false,
      });
      setAdvice(null);
      setLastGameStage(null);
    } catch (error) {
      console.error('Error resetting game:', error);
      Alert.alert('Error', 'Failed to reset game');
    }
  };

  // Function to get color based on recommendation
  const getRecommendationColor = (recommendation: string) => {
    const lowerRecommendation = recommendation.toLowerCase();
    switch(lowerRecommendation) {
      case 'fold': return '#F44336'; // red
      case 'check': return '#FF9800'; // orange
      case 'call': return '#4CAF50'; // green
      case 'raise': return '#4CAF50'; // green
      case 'all-in': return '#9775fa'; // purple
      default: return '#a0a0a0'; // gray
    }
  };

  // Helper to convert hex color to rgba with alpha
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  // Render the AI advice component
  const renderAdvice = () => {
    if (!gameData || !user) return null;
    const { hand } = gameData;

    // Only show advice if playerCards (hand) is present and non-empty
    if (!hand || hand.length === 0) {
      return (
        <ThemedView style={gameStyle.adviceContainer}>
          <ThemedText type="subtitle">AI Advisor</ThemedText>
          <ThemedText>Waiting for dealer...</ThemedText>
        </ThemedView>
      );
    }
    if (!advice) return null;

    const recommendationColor = getRecommendationColor(advice.recommendation);
    console.log("Recommendation: ", advice.recommendation);

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
            <ThemedText style={[{ color: 'black', fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 8 }]}> 
              {advice.advice}
            </ThemedText>
            <ThemedText style={gameStyle.reasoningText}>{advice.reasoning}</ThemedText>
            <ThemedView style={gameStyle.confidenceBar}>
              <ThemedView 
                style={[
                  gameStyle.confidenceFill, 
                  {width: `${advice.confidence}%`, backgroundColor: hexToRgba(recommendationColor, Math.max(0.2, advice.confidence / 100))}
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

  useEffect(() => {
    // Debug: Print all data under 'games' in the Realtime Database
    const gamesRef = ref(database, 'games');
    const unsubscribe = onValue(gamesRef, (snapshot) => {
      console.log('ALL GAMES SNAPSHOT:', snapshot.val());
    });
    return () => unsubscribe();
  }, []);

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

  const { hand, flop, turn, river, call } = gameData;
  const playerCards = hand || [];
  const currentStage = determineGameStage();

  // Build community cards array in correct order
  const communityCards = [
    ...(flop || []),
    ...(turn ? [turn] : []),
    ...(river ? [river] : []),
  ];

  // Debug: Print what is being rendered for hand and flop
  console.log('Rendering playerCards:', playerCards);
  console.log('Rendering communityCards:', communityCards);

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

  const renderCard = (cardValue: string | undefined) => {
    if (!cardValue) {
      return (
        <ThemedView style={gameStyle.card}>
          <ThemedText>Empty</ThemedText>
        </ThemedView>
      );
    }

    return (
      <Image
        source={cardImages[cardValue]}
        style={gameStyle.cardImage}
        resizeMode="contain"
      />
    );
  };

  return (
    <ScrollView style={gameStyle.container}>
      <ThemedView style={gameStyle.contentContainer}>
        <ThemedText type="title" style={gameStyle.title}>
          Game id: {id}
        </ThemedText>

        {/* Poker Table */}
        <ThemedView style={gameStyle.table}>
          {/* Community Cards */}
          <ThemedView style={gameStyle.communityCards}>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <ThemedView key={index} style={gameStyle.card}>
                {renderCard(communityCards[index])}
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
                {renderCard(playerCards[index])}
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

        {/* Game Result Buttons */}
        <ThemedView style={gameStyle.buttonContainer}>
          <ThemedButton
            onPress={handleWin}
            style={[gameStyle.button, gameStyle.winButton]}
            title="I Won"
          />
          <ThemedButton
            onPress={handleLoss}
            style={[gameStyle.button, gameStyle.lossButton]}
            title="I Lost"
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}