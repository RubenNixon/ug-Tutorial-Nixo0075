export const getPlayerRank = (level) => {
  let rank = "Novice";
  if (level >= 6) rank = "Adept";
  if (level >= 10) rank = "Master";

  return `Level ${level} ${rank}`;
};