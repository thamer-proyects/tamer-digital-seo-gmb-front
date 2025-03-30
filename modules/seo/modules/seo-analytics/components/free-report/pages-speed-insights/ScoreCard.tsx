import CircleProgress from '@/components/ui/circle-progress';

interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: Readonly<ScoreCardProps>) {
  return (
    <div className="relative inline-flex">
      <CircleProgress percentage={score} size={128} />
    </div>
  );
}
