import { useQuery } from "@tanstack/react-query";
import PlayerProfile from "@/components/dashboard/player-profile";
import QuickStats from "@/components/dashboard/quick-stats";
import RecentGames from "@/components/dashboard/recent-games";
import TrainingSchedule from "@/components/dashboard/training-schedule";
import CoachFeedback from "@/components/dashboard/coach-feedback";
import TournamentTracking from "@/components/dashboard/tournament-tracking";
import ProgressChart from "@/components/dashboard/progress-chart";
import SquadDetails from "@/components/dashboard/squad-details";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const playerId = 1; // Darshil's ID

  const { data: player, isLoading: playerLoading } = useQuery({
    queryKey: ["/api/players/1"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/summary", { playerId }],
  });

  if (playerLoading || statsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PlayerProfile player={player} stats={stats} />
      <QuickStats stats={stats} />
      <RecentGames playerId={playerId} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrainingSchedule playerId={playerId} />
        <CoachFeedback playerId={playerId} />
      </div>
      
      <TournamentTracking playerId={playerId} />
      <ProgressChart playerId={playerId} />
      <SquadDetails playerId={playerId} />
    </div>
  );
}
