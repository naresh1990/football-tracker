import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import HeroBanner from "@/components/modern/hero-banner";
import ColorfulCard from "@/components/modern/colorful-card";
import PlayerProfile from "@/components/dashboard/player-profile";
import RecentGames from "@/components/dashboard/recent-games";

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
  ChevronUp,
  Plus
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
  const playerId = 1; // Define playerId variable

  // Fetch player data
  const { data: player, isLoading: playerLoading } = useQuery({
    queryKey: ["/api/players/1"],
    staleTime: 0,
    cacheTime: 0,
  });

  // Fetch summary stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/all-time"],
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
  });

  // Fetch active club data
  const { data: activeClubData, isLoading: activeClubLoading } = useQuery({
    queryKey: ["/api/clubs/active", { playerId: 1 }],
    staleTime: 0,
    cacheTime: 0,
  });

  // Extract the first club from the array response
  const activeClub = activeClubData && activeClubData.length > 0 ? activeClubData[0] : null;

  // Fetch coaches for active club
  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches", { playerId: 1 }],
  });

  // Fetch squad members for active club
  const { data: squadMembers } = useQuery({
    queryKey: ["/api/squad"],
  });

  // Fetch tournaments to check for active ones
  const { data: tournaments } = useQuery({
    queryKey: ["/api/tournaments", { playerId }],
  });

  // Check if there are active tournaments
  const activeTournaments = tournaments?.filter((tournament: any) => 
    tournament.status !== 'completed'
  ) || [];

  // Fetch coach feedback to check if any exists
  const { data: coachFeedback } = useQuery({
    queryKey: ["/api/coach-feedback", { playerId }],
  });

  // Collapsible sections state - auto-collapse sections with no data
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    training: false,
    tournaments: false, // Will be updated after data loads
    recentGames: false,
    coachFeedback: false, // Will be updated after data loads
    teamProfile: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (playerLoading || statsLoading || activeClubLoading) {
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
        activeClub={activeClub}
        squadMembers={squadMembers}
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

        {/* Tournament Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 mb-8">
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
                    {activeTournaments?.length > 0 ? (
                      <TournamentTracking playerId={playerId} />
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Tournaments</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Ready to join a tournament? Create or register for one to start tracking your competitive journey.
                        </p>
                        <button 
                          onClick={() => setIsQuickAddOpen(true)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <Plus className="w-5 h-5 inline mr-2" />
                          Add Tournament
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

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
                    {coachFeedback?.length > 0 ? (
                      <CoachFeedback playerId={playerId} />
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <MessageSquare className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Coach Feedback Yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Your coaches haven't provided any feedback yet. Keep up the great work and check back soon!
                        </p>
                        <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-purple-800 text-sm font-medium">
                            💡 Tip: Ask your coach for feedback after training sessions to track your progress
                          </p>
                        </div>
                      </div>
                    )}
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
                  <SquadDetails playerId={playerId} activeClub={activeClub} coaches={coaches} squadMembers={squadMembers} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
      {/* Floating Quick Add Button */}
      <motion.button
        onClick={() => setIsQuickAddOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50 group"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Quick Add
        </span>
      </motion.button>
      {/* Quick Add Modal */}
      <QuickAddModal 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
      />
    </div>
  );
}