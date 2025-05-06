import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ref, onValue } from 'firebase/database';
import { database } from '@/app/lib/firebase';
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
    if (!user) return;

    // Always load the first available game from the database
    const gamesRef = ref(database, 'games');
    const unsubscribe = onValue(gamesRef, (snapshot) => {
      const games = snapshot.val();
      const gameKeys = games ? Object.keys(games) : [];
      if (gameKeys.length > 0) {
        const firstKey = gameKeys[0];
        const data = games[firstKey];
        console.log('Forcing load of first game:', firstKey, data);
        // Determine player key: use user.uid if present, otherwise fallback to first player
        let playerKey: string | undefined = user?.uid;
        if (!playerKey || !data.players?.[playerKey]) {
          playerKey = data.players ? Object.keys(data.players)[0] : undefined;
        }
        setGameData({
          flop: data.flop || [],
          turn: data.turn || null,
          river: data.river || null,
          playerHands: (data.players && playerKey) ? { [playerKey]: data.players[playerKey]?.hand || [] } : {},
          call: data.call || null,
          completed: data.completed || false,
        });
        if (data.completed) {
          setGameData(null); // Clear game data to show create game message
        }
        setLoading(false);
      } else {
        setLoading(false);
        Alert.alert('Error', 'No games found');
      }
    }, (error) => {
      console.error('Error listening to game updates:', error);
      Alert.alert('Error', 'Failed to connect to game');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

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
      const gameRef = ref(database, `games/${id}/win`);
      await onValue(gameRef, async (snapshot) => {
        const win = snapshot.val();
        if (win === true) {
          Alert.alert('Success', 'Game marked as won!');
          router.push('/(tabs)/history');
        } else {
          Alert.alert('Error', 'Game not marked as won');
        }
      });
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
      const gameRef = ref(database, `games/${id}/win`);
      await onValue(gameRef, async (snapshot) => {
        const win = snapshot.val();
        if (win === false) {
          Alert.alert('Success', 'Game marked as lost');
          router.push('/(tabs)/history');
        } else {
          Alert.alert('Error', 'Game not marked as lost');
        }
      });
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
      const gameRef = ref(database, `games/${id}/flop`);
      await onValue(gameRef, async (snapshot) => {
        const flop = snapshot.val();
        if (flop) {
          const gameRefTurn = ref(database, `games/${id}/turn`);
          await onValue(gameRefTurn, async (snapshotTurn) => {
            const turn = snapshotTurn.val();
            if (turn) {
              const gameRefRiver = ref(database, `games/${id}/river`);
              await onValue(gameRefRiver, async (snapshotRiver) => {
                const river = snapshotRiver.val();
                if (river) {
                  const gameRefPlayers = ref(database, `games/${id}/players`);
                  await onValue(gameRefPlayers, async (snapshotPlayers) => {
                    const players = snapshotPlayers.val();
                    if (players) {
                      const gameRefCall = ref(database, `games/${id}/call`);
                      await onValue(gameRefCall, async (snapshotCall) => {
                        const call = snapshotCall.val();
                        if (call) {
                          const gameRefCompleted = ref(database, `games/${id}/completed`);
                          await onValue(gameRefCompleted, async (snapshotCompleted) => {
                            const completed = snapshotCompleted.val();
                            if (completed) {
                              // Reset game data
                              setGameData({
                                flop: null,
                                turn: null,
                                river: null,
                                playerHands: {},
                                call: null,
                                completed: false,
                              });
                              // Reset advice when game is reset
                              setAdvice(null);
                              setLastGameStage(null);
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
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

  const { flop, turn, river, playerHands, call } = gameData;
  const playerCards = playerHands?.[user.uid] || [];
  const currentStage = determineGameStage();

  // Build community cards array in correct order
  const communityCards = [
    ...(flop || []),
    ...(turn ? [turn] : []),
    ...(river ? [river] : []),
  ];

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
          {[0, 1, 2, 3, 4].map((index) => (
            <ThemedView key={index} style={gameStyle.card}>
              <ThemedText>{communityCards[index] || ""}</ThemedText>
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