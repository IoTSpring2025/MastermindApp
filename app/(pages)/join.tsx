import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/app/lib/firebase'; // Adjust the import path as necessary


import { useAuth } from '@/app/lib/authContext';
  
 
const { user, loading } = useAuth();

const Join: React.FC = () => {
  const [gameCode, setGameCode] = useState('');
  const router = useRouter();

  const handleJoinGame = async () => {
    if (!gameCode.trim()) {
      alert('Please enter a game code.');
      return;
    }

    try {
      const gameRef = doc(db, 'games', gameCode);
      const gameDoc = await getDoc(gameRef);

      if (gameDoc.exists()) {
        router.push(`/gameroom/${gameCode}`); // Navigate to the game room
      } else {
        alert('Game not found. Please check the code and try again.');
      }
    } catch (error) {
      console.error('Error joining game:', error);
      alert('Failed to join the game. Please try again.');
    }
  };

  const handleCreateGame = async () => {
    const newGameId = uuidv4(); // Generate a unique game ID

    try {
      const gameRef = doc(db, 'games', newGameId);
      await setDoc(gameRef, {
        createdAt: new Date(),
        players: [], // You can add more fields as needed
      });

      router.push(`/gameroom/${newGameId}`); // Navigate to the new game room
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create a game. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Join or Create a Game</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter game code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
        <button
          onClick={handleJoinGame}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Join Game
        </button>
      </div>
      <button
        onClick={handleCreateGame}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Create Game
      </button>
    </div>
  );
};

export default Join;