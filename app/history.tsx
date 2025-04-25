import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
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

const History: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const userId = 'player1'; // Replace with actual user ID logic

  useEffect(() => {
    const fetchUserGames = async () => {
      try {
        const gamesRef = collection(db, 'games');
        const q = query(gamesRef, where('players', 'array-contains', userId));
        const querySnapshot = await getDocs(q);

        const userGames = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGames(userGames);
      } catch (error) {
        console.error('Error fetching user games:', error);
      }
    };

    fetchUserGames();
  }, [userId]);

  if (games.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>No game history found.</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Game History</h1>
      <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '10px' }}>Game ID</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Your Hand</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Flop</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Turn</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>River</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td style={{ border: '1px solid black', padding: '10px' }}>{game.id}</td>
              <td style={{ border: '1px solid black', padding: '10px' }}>
                {game.playerHands && game.playerHands[userId]
                  ? game.playerHands[userId].join(', ')
                  : 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '10px' }}>
                {game.flop ? game.flop.join(', ') : 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '10px' }}>
                {game.turn || 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '10px' }}>
                {game.river || 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '10px' }}>
                {game.winner === userId ? 'Win' : 'Loss'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;