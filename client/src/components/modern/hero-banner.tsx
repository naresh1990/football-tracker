import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import darshilPhoto from "../../assets/darshil-photo.jpg";
import { useQuery } from "@tanstack/react-query";
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
  activeClub?: any;
  squadMembers?: any[];
  onQuickAdd: () => void;
}

export default function HeroBanner({ player, activeClub, squadMembers, onQuickAdd }: HeroBannerProps) {
  // Fetch real stats data
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/summary"],
    staleTime: 0,
    cacheTime: 0,
  });

  if (!player) return null;

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-8 left-8 w-24 h-24 border-2 border-white/30 rounded-full"></div>
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-white/20 rounded-full"></div>
        <div className="absolute bottom-8 left-1/4 w-20 h-20 border-2 border-white/25 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-32 h-32 border border-white/15 rounded-full"></div>
        
        {/* Football pattern elements */}
        <div className="absolute top-1/4 left-1/2 w-6 h-6 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/6 w-8 h-8 bg-white/10 rounded-full"></div>
      </div>
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Player Avatar */}
          <motion.div 
            className="lg:col-span-1 flex justify-center lg:justify-start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="flex flex-col items-center space-y-6">
              <Avatar className="w-32 h-48 sm:w-36 sm:h-56 ring-4 ring-white/40 rounded-3xl shadow-2xl">
                <AvatarImage src={darshilPhoto} alt={player.name} className="object-cover rounded-3xl" />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl h-full w-full flex items-center justify-center">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {/* Jersey Details Card */}
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 shadow-sm w-full max-w-[140px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <Trophy className="w-4 h-4" />
                    <span className="text-lg font-bold">
                      #{squadMembers?.find(member => member.name === 'Darshil Podishetty')?.jerseyNumber || '9'}
                    </span>
                    <span className="text-lg font-bold">"Darsh"</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Player Info */}
          <motion.div 
            className="lg:col-span-2 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                textShadow: '3px 3px 12px rgba(0, 0, 0, 0.8)'
              }}
            >
              {player.name}
            </motion.h1>
            
            <motion.div 
              className="space-y-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-2 text-lg text-blue-100">
                <Target className="w-5 h-5 text-blue-300" />
                <span className="font-medium">
                  {squadMembers?.find(member => member.name === 'Darshil Podishetty')?.position || player.position}
                </span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-100">
                <Calendar className="w-5 h-5 text-blue-300" />
                <span>Age 8 (Born 2016)</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-100">
                <Building className="w-5 h-5 text-blue-300" />
                <span>{activeClub ? `${activeClub.name} ${activeClub.squadLevel || ''}` : 'No Active Club'}</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-100">
                <Star className="w-5 h-5 text-blue-300" />
                <span>
                  {activeClub && activeClub.seasonStart && activeClub.seasonEnd 
                    ? `${new Date(activeClub.seasonStart).getFullYear()}-${new Date(activeClub.seasonEnd).getFullYear().toString().slice(2)} Season`
                    : 'Current Season'
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-100">
                <MapPin className="w-5 h-5 text-blue-300" />
                <span className="text-sm">Sporthood Center of Excellence, HAL Sports Club</span>
              </div>
            </motion.div>

            <motion.p 
              className="text-lg text-blue-100 leading-relaxed max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' }}
            >
              Track your football journey with comprehensive analytics and performance insights.
            </motion.p>
          </motion.div>
          
          {/* Season Highlights Card */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl">Season Highlights</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <motion.div 
                  className="text-center p-4 bg-white/10 rounded-2xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  <div className="text-3xl font-bold text-white mb-1">{stats?.totalGames || 0}</div>
                  <div className="text-blue-200 text-sm font-medium">Games</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-white/10 rounded-2xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                >
                  <div className="text-3xl font-bold text-yellow-300 mb-1">{stats?.totalGoals || 0}</div>
                  <div className="text-blue-200 text-sm font-medium">Goals</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-white/10 rounded-2xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                >
                  <div className="text-3xl font-bold text-green-300 mb-1">{stats?.totalAssists || 0}</div>
                  <div className="text-blue-200 text-sm font-medium">Assists</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-white/10 rounded-2xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                >
                  <div className="text-3xl font-bold text-blue-300 mb-1">{stats?.winRate || 0}%</div>
                  <div className="text-blue-200 text-sm font-medium">Win Rate</div>
                </motion.div>
              </div>
              
              <motion.button
                onClick={onQuickAdd}
                className="bg-gradient-to-r from-white to-blue-50 text-blue-700 hover:from-blue-50 hover:to-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg w-full group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Target className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Add New Performance</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}