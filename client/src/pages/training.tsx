import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, MapPin, User, Target, Zap, Users, Activity, Trophy, Dumbbell, CheckCircle } from "lucide-react";
import { formatShortDate, formatTime } from "@/lib/utils";
import { motion } from "framer-motion";
import EmptyState from "@/components/ui/empty-state";
import TrainingForm from "@/components/forms/training-form";

export default function Training() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/training"],
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 text-lg font-medium">Loading training sessions...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingSessions = sessions?.filter((session: any) => !session.completed) || [];
  const completedSessions = sessions?.filter((session: any) => session.completed) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Training Sessions</h1>
            <p className="text-gray-600">Track your training progress and upcoming sessions</p>
          </div>
          <TrainingForm />
        </motion.div>

        {/* Upcoming Sessions Section */}
        {upcomingSessions.length > 0 && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Upcoming Sessions
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {upcomingSessions.map((session: any, index: number) => {
                const TrainingIcon = getTrainingIcon(session.type);
                const colorClass = getTrainingColor(session.type);
                
                return (
                  <motion.div key={session.id} variants={itemVariants}>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-md`}>
                              <TrainingIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-900">{session.type}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{session.focus || 'Training session'}</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Upcoming
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                            <div className="font-semibold text-gray-900 text-sm">{formatShortDate(session.date).split(',')[0]}</div>
                            <div className="text-xs text-gray-500">{formatTime(session.date)}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Clock className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                            <div className="font-semibold text-gray-900 text-sm">{session.duration || 90}</div>
                            <div className="text-xs text-gray-500">min</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                            <div className="font-semibold text-gray-900 text-xs leading-tight">{session.location || 'Training Ground'}</div>
                          </div>
                        </div>

                        {session.coach && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{session.coach}</span>
                          </div>
                        )}

                        {session.notes && (
                          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-gray-700 leading-relaxed">{session.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 hover:bg-blue-50">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {/* Completed Sessions Section */}
        {completedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Completed Sessions
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {completedSessions.map((session: any, index: number) => {
                const TrainingIcon = getTrainingIcon(session.type);
                const colorClass = getTrainingColor(session.type);
                
                return (
                  <motion.div key={session.id} variants={itemVariants}>
                    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full opacity-90">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-md opacity-80`}>
                              <TrainingIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-900">{session.type}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{session.focus || 'Training session'}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                            <div className="font-semibold text-gray-900 text-sm">{formatShortDate(session.date).split(',')[0]}</div>
                            <div className="text-xs text-gray-500">{formatTime(session.date)}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Clock className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                            <div className="font-semibold text-gray-900 text-sm">{session.duration || 90}</div>
                            <div className="text-xs text-gray-500">min</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                            <div className="font-semibold text-gray-900 text-xs leading-tight">{session.location || 'Training Ground'}</div>
                          </div>
                        </div>

                        {session.coach && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{session.coach}</span>
                          </div>
                        )}

                        {session.notes && (
                          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                            <p className="text-sm text-gray-700 leading-relaxed">{session.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 hover:bg-gray-50">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {(!sessions || sessions.length === 0) && (
          <EmptyState
            icon={Dumbbell}
            title="No training sessions yet"
            description="Start tracking your football training journey to monitor progress and improve your skills systematically."
            actionLabel="Add Your First Session"
            action={<TrainingForm />}
          />
        )}
      </div>
    </div>
  );
}