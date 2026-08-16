import { useState } from 'react';
import { getPlayerRank } from '../utils/gameLogic.js';

function PlayerProfile() {
  const [player, setPlayer] = useState({
    username: "PixelPioneer",
    level: 5,
    active: true
  });

  const { username, level, active } = player;

  const handleLevelUp = () => {
    const updatedPlayer = { ...player, level: level + 1 };
    setPlayer(updatedPlayer);
  };
  
  return (
    <>
      <div className="profile-card">
        <h2>Player: {username}</h2>
        <p>Rank: {getPlayerRank(level)}</p>
        <button onClick={handleLevelUp}>Gain XP</button>
        {active ? <p>Status: Online</p> : <p>Status: Offline</p>}
      </div>
    </>
  );
}

export default PlayerProfile;