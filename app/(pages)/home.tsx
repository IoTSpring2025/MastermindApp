import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleEnter = () => {
    if (code.trim()) {
      alert(`Code entered: ${code}`);
      setCode(''); // Clear the input field
    } else {
      alert('Please enter a code.');
    }
  };

  const goToHistory = () => {
    router.push('/history');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Poker Web App</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter your code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
        <button
          onClick={handleEnter}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Enter
        </button>
      </div>
      <button
        onClick={goToHistory}
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
        Go to History
      </button>
    </div>
  );
};

export default Home;