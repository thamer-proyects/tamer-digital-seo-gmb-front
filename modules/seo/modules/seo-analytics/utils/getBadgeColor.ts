export const getBadgeColor = (desktopScore: number, mobileScore: number, isSelected: boolean) => {
  const minScore = Math.min(desktopScore, mobileScore);

  if (minScore >= 90)
    return isSelected
      ? 'bg-green-500/80 text-white border-2 border-green-600'
      : 'bg-green-500/20 text-green-500 border-2 border-green-400';
  if (minScore >= 50)
    return isSelected
      ? 'bg-yellow-500/80 text-white border-2 border-yellow-600'
      : 'bg-yellow-500/20 text-yellow-500 border-2 border-yellow-400';
  return isSelected
    ? 'bg-red-500/80 text-white border-2 border-red-600'
    : 'bg-red-500/20 text-red-500 border-2 border-red-400';
};
