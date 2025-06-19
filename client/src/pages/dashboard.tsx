import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import HeroSection from "@/components/modern/hero-section";
import PlayerProfile from "@/components/dashboard/player-profile";
import QuickStats from "@/components/dashboard/quick-stats";
import RecentGames from "@/components/dashboard/recent-games";
import UpcomingTraining from "@/components/dashboard/training-schedule";
import ProgressChart from "@/components/dashboard/progress-chart";
import CoachFeedback from "@/components/dashboard/coach-feedback";
import TournamentTracking from "@/components/dashboard/tournament-tracking";
import SquadDetails from "@/components/dashboard/squad-details";
import QuickAddModal from "@/components/modals/quick-add-modal";

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
      <div className="min-h-screen bg-gradient-to-br from-football-primary to-football-secondary flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
            Loading your football journey...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <HeroSection 
        player={player} 
        onQuickAdd={() => setIsQuickAddOpen(true)} 
      />

      {/* Main Dashboard Content */}
      <motion.div 
        className="relative -mt-16 z-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-6 pb-16 space-y-12">
          {/* Quick Stats Section */}
          <motion.div variants={itemVariants}>
            <QuickStats stats={stats} />
          </motion.div>

          {/* Performance and Activity Section */}
          <motion.div 
            className="grid gap-8 lg:grid-cols-2"
            variants={itemVariants}
          >
            <ProgressChart playerId={1} />
            <RecentGames playerId={1} />
          </motion.div>

          {/* Insights Section */}
          <motion.div 
            className="grid gap-8 lg:grid-cols-3"
            variants={itemVariants}
          >
            <UpcomingTraining playerId={1} />
            <CoachFeedback playerId={1} />
            <TournamentTracking playerId={1} />
          </motion.div>

          {/* Player Profile Section */}
          <motion.div 
            className="grid gap-8 lg:grid-cols-3"
            variants={itemVariants}
          >
            <div className="lg:col-span-2">
              <SquadDetails playerId={1} />
            </div>
            <div className="lg:col-span-1">
              <PlayerProfile player={player} stats={stats} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Add Modal */}
      <QuickAddModal 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
      />
    </div>
  );
}