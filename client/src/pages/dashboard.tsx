import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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
  Goal, 
  Circle, 
  Users, 
  TrendingUp,
  Calendar,
  Star,
  Trophy,
  Activity,
  Award,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp
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
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    training: false,
    tournaments: false,
    recentGames: false,
    coachFeedback: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const playerId = 1; // Define playerId variable

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
              icon={<Goal />}
              color="success"
              trend={{ value: "+15%", isPositive: true }}
            />
            <ColorfulCard
              title="Total Assists"
              value={stats?.totalAssists || 0}
              icon={<Circle />}
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

        

        {/* Performance Analytics Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 mb-8">
            <button
              onClick={() => toggleSection('performanceAnalytics')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors rounded-t-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Performance Analytics</h2>
              </div>
              {collapsedSections.performanceAnalytics ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {!collapsedSections.performanceAnalytics && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 m-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl shadow-sm">
                    <ProgressChart playerId={1} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Recent Games Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 mb-8">
            <button
              onClick={() => toggleSection('recentGames')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors rounded-t-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                  <Goal className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Recent Games</h2>
              </div>
              {collapsedSections.recentGames ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {!collapsedSections.recentGames && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 m-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                    <RecentGames playerId={1} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Training & Tournaments Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Training Schedule */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0">
              <button
                onClick={() => toggleSection('training')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Training Schedule</h2>
                </div>
                {collapsedSections.training ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {!collapsedSections.training && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 m-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                      <UpcomingTraining playerId={playerId} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Tournament Tracking */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0">
              <button
                onClick={() => toggleSection('tournaments')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Current Tournaments</h2>
                </div>
                {collapsedSections.tournaments ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {!collapsedSections.tournaments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 m-4 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl shadow-sm">
                      <TournamentTracking playerId={playerId} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Coach Feedback Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 mb-8">
            <button
              onClick={() => toggleSection('coachFeedback')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors rounded-t-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Coach Feedback</h2>
              </div>
              {collapsedSections.coachFeedback ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {!collapsedSections.coachFeedback && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 m-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow-sm">
                    <CoachFeedback playerId={playerId} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Team & Profile Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 mb-8">
            <button
              onClick={() => toggleSection('teamProfile')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors rounded-t-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Team & Profile</h2>
              </div>
              {collapsedSections.teamProfile ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {!collapsedSections.teamProfile && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 m-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl shadow-sm">
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <SquadDetails playerId={1} />
                      </div>
                      <div className="lg:col-span-1">
                        <PlayerProfile player={player} stats={stats} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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