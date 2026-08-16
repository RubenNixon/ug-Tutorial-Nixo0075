import { useState } from 'react';

function PlayerStats() {
  const [player, setPlayer] = useState({
    health: 100,
    gold: 0
  });

  const { health, gold } = player;

  const takeDamage = () => {
    const updatedPlayer = { ...player, health: health - 20 };
    setPlayer(updatedPlayer);
  };

  const findLoot = () => {
    const updatedPlayer = { ...player, gold: gold + 10 };
    setPlayer(updatedPlayer);
  };

  return (
    <>
      <div className="profile-card">
        <h2>Player Stats</h2>
        <p>Health: {health}</p>
        <p>Gold: {gold}</p>
        <button onClick={takeDamage}>Take Damage</button>
        <button onClick={findLoot}>Find Loot</button>
        {health <= 40 ? <p>Warning: Low Health!</p> : <p>Status: Healthy</p>}
      </div>
    </>
  );
}

export default PlayerStats;