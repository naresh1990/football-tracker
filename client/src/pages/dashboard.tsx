import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import HeroBanner from "@/components/modern/hero-banner";
import ColorfulCard from "@/components/modern/colorful-card";
import PlayerProfile from "@/components/dashboard/player-profile";
import RecentGames from "@/components/dashboard/recent-games";
import UpcomingTraining from "@/components/dashboard/training-schedule";
import ProgressChart from "@/components/dashboard/progress-chart";
import CoachFeedback from "@/components/dashboard/coach-feedback";
import TournamentTracking from "@/components/dashboard/tournament-tracking";
import SquadDetails from "@/components/dashboard/squad-details";
import QuickAddModal from "@/components/modals/quick-add-modal";
import { 
  Trophy, 
  Target, 
  Users, 
  TrendingUp,
  Calendar,
  Star,
  Award,
  Activity
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function Dashboard() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Fetch player data
  const { data: player, isLoading: playerLoading } = useQuery({
    queryKey: ["/api/players/1"],
  });

  // Fetch summary stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/summary"],
  });

  if (playerLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading your football journey...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <HeroBanner 
        player={player} 
        onQuickAdd={() => setIsQuickAddOpen(true)} 
      />

      {/* Main Dashboard Content */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stats Grid */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Performance Overview
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <ColorfulCard
              title="Total Goals"
              value={stats?.totalGoals || 0}
              icon={<Target />}
              color="success"
              trend={{ value: "+15%", isPositive: true }}
            />
            <ColorfulCard
              title="Total Assists"
              value={stats?.totalAssists || 0}
              icon={<Users />}
              color="info"
              trend={{ value: "+8%", isPositive: true }}
            />
            <ColorfulCard
              title="Games Played"
              value={stats?.totalGames || 0}
              icon={<Trophy />}
              color="warning"
              trend={{ value: "3 this month", isPositive: true }}
            />
            <ColorfulCard
              title="Win Rate"
              value={`${stats?.winPercentage || 0}%`}
              icon={<TrendingUp />}
              color="secondary"
              trend={{ value: "+12%", isPositive: true }}
            />
          </div>
        </motion.div>

        {/* Performance Charts */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Performance & Activity
          </h2>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <ProgressChart playerId={1} />
            <RecentGames playerId={1} />
          </div>
        </motion.div>

        {/* Insights Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-blue-600" />
            Latest Updates
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <UpcomingTraining playerId={1} />
            <CoachFeedback playerId={1} />
            <TournamentTracking playerId={1} />
          </div>
        </motion.div>

        {/* Team & Profile Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Team & Profile
          </h2>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SquadDetails playerId={1} />
            </div>
            <div className="lg:col-span-1">
              <PlayerProfile player={player} stats={stats} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Add Modal */}
      <QuickAddModal 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
      />
    </div>
  );
}