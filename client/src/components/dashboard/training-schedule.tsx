import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, MapPin, Dumbbell } from "lucide-react";
import { formatShortDate, formatTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface TrainingScheduleProps {
  playerId: number;
}

export default function TrainingSchedule({ playerId }: TrainingScheduleProps) {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/training/upcoming", { playerId }],
  });

  const getTrainingIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'speed & agility':
        return Zap;
      case 'ball control':
        return Target;
      case 'team practice':
        return Users;
      default:
        return Target;
    }
  };

  const getTrainingColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'speed & agility':
        return 'bg-football-green bg-opacity-20 text-football-green';
      case 'ball control':
        return 'bg-trophy-gold bg-opacity-20 text-trophy-gold';
      case 'team practice':
        return 'bg-field-green bg-opacity-20 text-field-green';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Training Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Training Schedule</CardTitle>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
              {sessions?.slice(0, 2).map((session: any, index: number) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:bg-white/90 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                        <Dumbbell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{session.type}</h3>
                        <p className="text-sm text-gray-600">{session.focus || 'General training'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatShortDate(session.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{session.duration || 90} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{session.location || 'Training Ground'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
