import { motion } from "framer-motion";
import StatsDisplay from "@/components/ui/stats-display";
import { Trophy, Target, TrendingUp, Users } from "lucide-react";

interface QuickStatsProps {
  stats: any;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  if (!stats) return null;

  const statsCards = [
    {
      title: "This Season",
      value: stats.seasonGoals,
      label: "Goals Scored",
      icon: Target,
      bgColor: "bg-field-green bg-opacity-20",
      iconColor: "text-field-green",
    },
    {
      title: "This Month",
      value: stats.monthAssists,
      label: "Assists",
      icon: HandHeart,
      bgColor: "bg-trophy-gold bg-opacity-20",
      iconColor: "text-trophy-gold",
    },
    {
      title: "Win Rate",
      value: `${stats.winRate}%`,
      label: "Matches Won",
      icon: Trophy,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Next Game",
      value: "3 Days",
      label: "vs Eagles FC",
      icon: Calendar,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-football-green">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <stat.icon className={`${stat.iconColor} w-6 h-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
