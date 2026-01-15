import StreakDisplay from '@/components/StreakDisplay';
import MotivationalQuote from '@/components/MotivationalQuote';

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Progress</h1>
        <p className="text-zinc-500 mt-1">Track your achievements and growth</p>
      </div>
      
      <MotivationalQuote variant="banner" />
      
      <StreakDisplay />
    </div>
  );
}
