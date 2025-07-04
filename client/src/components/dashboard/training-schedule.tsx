import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, MapPin, Dumbbell, Zap, Target, Users, Activity, Trophy } from "lucide-react";
import { formatShortDate, formatTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import moment from "moment-timezone";

interface TrainingScheduleProps {
  playerId: number;
}

export default function TrainingSchedule({ playerId }: TrainingScheduleProps) {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/training/upcoming", { playerId }],
  });

  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches"],
  });

  const { data: clubs } = useQuery({
    queryKey: ["/api/clubs"],
  });

  const getTrainingIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'speed & agility':
        return Zap;
      case 'ball control':
        return Target;
      case 'team practice':
        return Users;
      case 'fitness training':
        return Activity;
      case 'shooting practice':
        return Trophy;
      default:
        return Dumbbell;
    }
  };

  const getTrainingColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'speed & agility':
        return 'from-yellow-400 to-orange-500';
      case 'ball control':
        return 'from-blue-400 to-blue-500';
      case 'team practice':
        return 'from-green-400 to-green-500';
      case 'fitness training':
        return 'from-red-400 to-red-500';
      case 'shooting practice':
        return 'from-purple-400 to-purple-500';
      default:
        return 'from-green-400 to-green-500';
    }
  };

  const getCoachAndClub = (coachName: string) => {
    const coach = coaches?.find((c: any) => c.name === coachName);
    if (!coach) return { coachName, clubName: null };
    
    const club = clubs?.find((c: any) => c.id === coach.clubId);
    return { 
      coachName: coach.name, 
      clubName: club?.name || null 
    };
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Training Schedule</CardTitle>
        </CardHeader>
        <div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        
        <div>
          {sessions && sessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-gray-600 font-medium">No upcoming training sessions</p>
              <p className="text-sm text-gray-500 mt-1">Schedule your next training session</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions?.slice(0, 2).map((session: any, index: number) => {
                const TrainingIcon = getTrainingIcon(session.type);
                const colorClass = getTrainingColor(session.type);
                const { coachName, clubName } = getCoachAndClub(session.coach);
                
                return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:bg-white/90 transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}>
                      <TrainingIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{session.type}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {coachName && clubName ? `${coachName} • ${clubName}` : 
                         coachName ? coachName : 
                         'Training session'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <Calendar className="w-3 h-3" />
                      </div>
                      <span className="font-semibold text-gray-900">{formatShortDate(session.date).split(',')[0]}</span>
                      <span className="text-xs text-gray-500">{formatShortDate(session.date).split(',')[1]?.trim()}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <Clock className="w-3 h-3" />
                      </div>
                      <span className="font-semibold text-gray-900">{moment.tz(session.date, 'Asia/Kolkata').format('h:mm A')}</span>
                      <span className="text-xs text-gray-500">{session.duration || 90} min</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <MapPin className="w-3 h-3" />
                      </div>
                      <span className="font-semibold text-gray-900 text-xs leading-tight">{session.location || 'Training Ground'}</span>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
