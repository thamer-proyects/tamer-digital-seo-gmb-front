export const getStatusColorForSeoOnPageScore = (score: number) => {
  let color;
  if (score >= 0.9) {
    color = 'text-green-500';
  } else if (score >= 0.5) {
    color = 'text-yellow-500';
  } else {
    color = 'text-red-500';
  }
  return color;
};
