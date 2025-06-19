import React from "react";
import { motion } from "framer-motion";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Target, Calendar, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  player: any;
  onQuickAdd: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ player, onQuickAdd }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-football-primary via-football-secondary to-football-dark min-h-[500px]">
      {/* Background Pattern */}
      <div className="absolute inset-0 field-pattern opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute top-32 right-20 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: "4s" }}></div>
      
      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>

      <div className="relative z-10 px-6 py-16 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Player Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white"
          >
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-20 h-20 ring-4 ring-white/30">
                <AvatarImage src={player.profilePicture} alt={player.name} />
                <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                  {player.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <motion.h1
                  className="text-4xl lg:text-6xl font-bold text-display text-gradient"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  {player.name}
                </motion.h1>
                <motion.p
                  className="text-xl text-white/80 mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {player.position} • {player.team}
                </motion.p>
              </div>
            </div>

            <motion.p
              className="text-lg text-white mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'
              }}
            >
              Track every moment of your football journey with comprehensive performance analytics, 
              club management, and professional development tracking.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <ModernButton
                variant="glass"
                size="lg"
                onClick={onQuickAdd}
                icon={<Target className="w-5 h-5" />}
              >
                Record Performance
              </ModernButton>
              
              <ModernButton
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-football-primary"
                icon={<TrendingUp className="w-5 h-5" />}
              >
                View Analytics
              </ModernButton>
            </motion.div>
          </motion.div>

          {/* Right Column - Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-6"
          >
            <ModernCard className="p-6 bg-white/95 backdrop-blur-xl border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Season Overview</h3>
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <motion.div
                    className="text-3xl font-bold text-football-primary text-display"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 1 }}
                  >
                    12
                  </motion.div>
                  <p className="text-gray-600 text-sm">Games Played</p>
                </div>
                
                <div className="text-center">
                  <motion.div
                    className="text-3xl font-bold text-yellow-600 text-display"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 1.2 }}
                  >
                    8
                  </motion.div>
                  <p className="text-gray-600 text-sm">Goals</p>
                </div>
                
                <div className="text-center">
                  <motion.div
                    className="text-3xl font-bold text-blue-600 text-display"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 1.4 }}
                  >
                    5
                  </motion.div>
                  <p className="text-gray-600 text-sm">Assists</p>
                </div>
                
                <div className="text-center">
                  <motion.div
                    className="text-3xl font-bold text-green-600 text-display"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 1.6 }}
                  >
                    75%
                  </motion.div>
                  <p className="text-gray-600 text-sm">Win Rate</p>
                </div>
              </div>
            </ModernCard>

            <ModernCard className="p-6 bg-white/95 backdrop-blur-xl border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Next Training</h3>
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Technical Skills</span>
                  <span className="text-gray-800 text-sm font-medium">Tomorrow 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Match Preparation</span>
                  <span className="text-gray-800 text-sm font-medium">Saturday 10:00 AM</span>
                </div>
              </div>
            </ModernCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;