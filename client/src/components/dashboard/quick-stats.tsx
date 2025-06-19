import { motion } from "framer-motion";
import StatsDisplay from "@/components/ui/stats-display";
import { Trophy, Target, TrendingUp, Users } from "lucide-react";

interface QuickStatsProps {
  stats: any;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const statsData = [
    {
      title: "Total Goals",
      value: stats.totalGoals,
      subtitle: "Season performance",
      icon: <Target className="h-6 w-6" />,
      trend: "up" as const,
      trendValue: "+15%",
      variant: "gradient" as const
    },
    {
      title: "Total Assists",
      value: stats.totalAssists,
      subtitle: "Playmaking ability",
      icon: <Users className="h-6 w-6" />,
      trend: "up" as const,
      trendValue: "+8%",
      variant: "premium" as const
    },
    {
      title: "Games Played",
      value: stats.totalGames,
      subtitle: "Match experience",
      icon: <Trophy className="h-6 w-6" />,
      trend: "neutral" as const,
      trendValue: "3 this month",
      variant: "premium" as const
    },
    {
      title: "Win Rate",
      value: `${stats.winPercentage}%`,
      subtitle: "Success rate",
      icon: <TrendingUp className="h-6 w-6" />,
      trend: "up" as const,
      trendValue: "+12%",
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