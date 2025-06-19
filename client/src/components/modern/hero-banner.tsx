import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Target, 
  Users, 
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  Building
} from "lucide-react";

interface HeroBannerProps {
  player: any;
  onQuickAdd: () => void;
}

export default function HeroBanner({ player, onQuickAdd }: HeroBannerProps) {
  if (!player) return null;

  return (
    <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start space-x-6 mb-6">
            {/* Vertical Player Image */}
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-32 sm:w-28 sm:h-36 ring-4 ring-white/30 rounded-2xl">
                <AvatarFallback className="text-xl font-bold bg-blue-600 text-white rounded-2xl h-full w-full flex items-center justify-center">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Player Info and Season Highlights */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Player Details */}
              <div>
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{
                    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7), 1px 1px 4px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {player.name}
                </motion.h1>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-4 text-white">
                    <div className="flex items-center gap-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' }}>
                      <Target className="w-4 h-4" />
                      <span>{player.position}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' }}>
                      <MapPin className="w-4 h-4" />
                      <span>Sporthood Center of Excellence, HAL Sports Club</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white">
                    <div className="flex items-center gap-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' }}>
                      <Calendar className="w-4 h-4" />
                      <span>Age 8 (Born 2016)</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' }}>
                      <Building className="w-4 h-4" />
                      <span>Sporthood U10 Elite Squad</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' }}>
                      <Star className="w-4 h-4" />
                      <span>2025-26 Season</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-white/90" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' }}>
                    <Trophy className="w-4 h-4" />
                    <span>Jersey #18 "Darsh"</span>
                  </div>
                </div>
              </div>
              
              {/* Season Highlights */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <h3 className="text-white font-semibold text-lg">Season Highlights</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-white/80 text-sm">Games</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">8</div>
                    <div className="text-white/80 text-sm">Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">5</div>
                    <div className="text-white/80 text-sm">Assists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300">75%</div>
                    <div className="text-white/80 text-sm">Win Rate</div>
                  </div>
                </div>
                
                <motion.button
                  onClick={onQuickAdd}
                  className="bg-white text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg w-full mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target className="w-4 h-4" />
                  Add New Performance
                </motion.button>
              </div>
            </div>
          </div>

          <motion.p 
            className="text-lg text-white mt-4 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)'
            }}
          >
            Track your football journey with comprehensive analytics and performance insights.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}