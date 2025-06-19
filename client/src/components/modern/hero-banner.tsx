import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Target, 
  Users, 
  TrendingUp,
  Calendar,
  MapPin,
  Star
} from "lucide-react";

interface HeroBannerProps {
  player: any;
  onQuickAdd: () => void;
}

export default function HeroBanner({ player, onQuickAdd }: HeroBannerProps) {
  if (!player) return null;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Player Info */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-white/30">
                <AvatarImage src={player.profilePicture} alt={player.name} />
                <AvatarFallback className="text-xl font-bold bg-white/20 text-white">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-heading mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {player.name}
                </motion.h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{player.position}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{player.team}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Age {player.age}</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.p 
              className="text-lg text-white/90 mb-6 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Track your football journey with comprehensive analytics and performance insights.
            </motion.p>

            <motion.button
              onClick={onQuickAdd}
              className="bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target className="w-4 h-4" />
              Add New Performance
            </motion.button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                Season Highlights
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <motion.div 
                    className="text-2xl font-bold mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    12
                  </motion.div>
                  <p className="text-white/80 text-sm">Games</p>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-2xl font-bold mb-1 text-yellow-300"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    8
                  </motion.div>
                  <p className="text-white/80 text-sm">Goals</p>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-2xl font-bold mb-1 text-green-300"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: "spring" }}
                  >
                    5
                  </motion.div>
                  <p className="text-white/80 text-sm">Assists</p>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-2xl font-bold mb-1 text-blue-300"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.4, type: "spring" }}
                  >
                    75%
                  </motion.div>
                  <p className="text-white/80 text-sm">Win Rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}