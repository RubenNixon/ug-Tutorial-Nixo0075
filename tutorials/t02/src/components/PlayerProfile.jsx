function PlayerProfile() {
  const player = { username: "PixelPioneer", level: 5, active: true };
  const { username, level, active } = player;

  return (
    <div className="profile-card">
      <h2>Player: {username}</h2>
      <p>Current Level: {level}</p>
    </div>
  );
}

export default PlayerProfile;