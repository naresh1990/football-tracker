import { motion } from "framer-motion";
import StatsDisplay from "@/components/ui/stats-display";
import { Trophy, Target, TrendingUp, Users } from "lucide-react";

interface QuickStatsProps {
  stats: any;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  // Calculate dynamic trend values based on actual data
  const getTrendValue = (current: number, type: string) => {
    if (current === 0) return "No data yet";
    
    switch (type) {
      case "goals":
        return `${stats.seasonGoals || 0} this season`;
      case "assists":
        return `${stats.monthAssists || 0} this month`;
      case "games":
        return `${current} total`;
      case "winrate":
        return current > 0 ? `${current}% success` : "No games yet";
      default:
        return "Track progress";
    }
  };

  const getTrendDirection = (current: number, type: string) => {
    if (current === 0) return "neutral" as const;
    if (type === "winrate" && current >= 50) return "up" as const;
    if (current > 0) return "up" as const;
    return "neutral" as const;
  };

  const statsData = [
    {
      title: "Total Goals",
      value: stats.totalGoals || 0,
      subtitle: "Season performance",
      icon: <Target className="h-6 w-6" />,
      trend: getTrendDirection(stats.totalGoals, "goals"),
      trendValue: getTrendValue(stats.totalGoals, "goals"),
      variant: "gradient" as const
    },
    {
      title: "Total Assists",
      value: stats.totalAssists || 0,
      subtitle: "Playmaking ability",
      icon: <Users className="h-6 w-6" />,
      trend: getTrendDirection(stats.totalAssists, "assists"),
      trendValue: getTrendValue(stats.totalAssists, "assists"),
      variant: "premium" as const
    },
    {
      title: "Games Played",
      value: stats.totalGames || 0,
      subtitle: "Match experience",
      icon: <Trophy className="h-6 w-6" />,
      trend: getTrendDirection(stats.totalGames, "games"),
      trendValue: getTrendValue(stats.totalGames, "games"),
      variant: "premium" as const
    },
    {
      title: "Win Rate",
      value: `${stats.winRate || 0}%`,
      subtitle: "Success rate",
      icon: <TrendingUp className="h-6 w-6" />,
      trend: getTrendDirection(stats.winRate, "winrate"),
      trendValue: getTrendValue(stats.winRate, "winrate"),
      variant: "premium" as const
    }
  ];

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <StatsDisplay {...stat} />
        </motion.div>
      ))}
    </div>
  );
}