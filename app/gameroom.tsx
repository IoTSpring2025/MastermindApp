import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Firebase configuration (replace with your Firebase project config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const GameRoom: React.FC = () => {
  const router = useRouter();
  const { gameId } = router.query; // Get the gameId from the URL
  const [gameData, setGameData] = useState<any>(null);
  const [playerId, setPlayerId] = useState<string>('player1'); // Replace with actual player ID logic

  useEffect(() => {
    if (!gameId) return;

    const fetchGameData = async () => {
      const gameRef = doc(db, 'games', gameId as string);
      const gameDoc = await getDoc(gameRef);

      if (gameDoc.exists()) {
        setGameData(gameDoc.data());
      } else {
        alert('Game not found.');
        router.push('/join'); // Redirect to join page if game doesn't exist
      }
    };

    fetchGameData();
  }, [gameId]);

  const handleWin = async () => {
    if (!gameId) return;

    try {
      const gameRef = doc(db, 'games', gameId as string);
      await updateDoc(gameRef, {
        winner: playerId,
        roundOver: true,
      });

      alert('You won the round!');
      resetGame();
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  const handleLoss = async () => {
    if (!gameId) return;

    try {
      const gameRef = doc(db, 'games', gameId as string);
      await updateDoc(gameRef, {
        winner: null,
        roundOver: true,
      });

      alert('You lost the round.');
      resetGame();
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  const resetGame = async () => {
    if (!gameId) return;

    try {
      const gameRef = doc(db, 'games', gameId as string);
      await updateDoc(gameRef, {
        flop: null,
        turn: null,
        river: null,
        playerHands: {},
        call: null,
        roundOver: false,
      });

      setGameData(null); // Reset local state
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  if (!gameData) {
    return <div>Loading game data...</div>;
  }

  const { flop, turn, river, playerHands, call } = gameData;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Game Room: {gameId}</h1>
      <div style={{ margin: '20px auto', width: '600px', height: '400px', border: '2px solid black', borderRadius: '10px', position: 'relative' }}>
        {/* Poker Table */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          {/* Flop, Turn, River */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {flop && flop.map((card: string, index: number) => (
              <div key={index} style={{ width: '50px', height: '70px', border: '1px solid black', textAlign: 'center', lineHeight: '70px' }}>
                {card}
              </div>
            ))}
            {turn && (
              <div style={{ width: '50px', height: '70px', border: '1px solid black', textAlign: 'center', lineHeight: '70px' }}>
                {turn}
              </div>
            )}
            {river && (
              <div style={{ width: '50px', height: '70px', border: '1px solid black', textAlign: 'center', lineHeight: '70px' }}>
                {river}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player's Hand */}
      <div style={{ marginTop: '20px' }}>
        <h2>Your Hand</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {playerHands && playerHands[playerId] && playerHands[playerId].map((card: string, index: number) => (
            <div key={index} style={{ width: '50px', height: '70px', border: '1px solid black', textAlign: 'center', lineHeight: '70px' }}>
              {card}
            </div>
          ))}
        </div>
      </div>

      {/* Call/Bet/Fold */}
      <div style={{ marginTop: '20px' }}>
        <h2>Action: {call || 'Waiting...'}</h2>
      </div>

      {/* Win/Loss Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleWin}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
          }}
        >
          Win
        </button>
        <button
          onClick={handleLoss}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Loss
        </button>
      </div>
    </div>
  );
};

export default GameRoom;