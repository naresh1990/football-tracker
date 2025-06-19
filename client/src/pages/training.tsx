import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Target, Zap, Clock, MapPin } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Training() {
  const playerId = 1;

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/training", { playerId }],
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
        return 'bg-football-green text-white';
      case 'ball control':
        return 'bg-trophy-gold text-black';
      case 'team practice':
        return 'bg-field-green text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Training</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Training
          </Button>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Separate upcoming and past sessions
  const now = new Date();
  const upcomingSessions = sessions?.filter((session: any) => new Date(session.date) >= now) || [];
  const pastSessions = sessions?.filter((session: any) => new Date(session.date) < now) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Training</h1>
        <Button className="bg-football-green hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Training
        </Button>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-football-green">Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming training sessions</p>
              </div>
            ) : (
              upcomingSessions.map((session: any) => {
                const Icon = getTrainingIcon(session.type);
                const colorClass = getTrainingColor(session.type);

                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{session.type}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(session.date)} at {formatTime(session.date)}
                          </span>
                          {session.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {session.location}
                            </span>
                          )}
                        </div>
                        {session.coach && (
                          <p className="text-sm text-gray-600">Coach: {session.coach}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {session.duration} minutes
                      </Badge>
                      {session.notes && (
                        <p className="text-xs text-gray-500 max-w-xs truncate">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Past Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">Training History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastSessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No training history available</p>
              </div>
            ) : (
              pastSessions.map((session: any) => {
                const Icon = getTrainingIcon(session.type);
                const colorClass = getTrainingColor(session.type);

                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-75"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{session.type}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatDate(session.date)}</span>
                          {session.location && <span>{session.location}</span>}
                        </div>
                        {session.coach && (
                          <p className="text-sm text-gray-600">Coach: {session.coach}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {session.duration} minutes
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Badge variant={session.completed ? "default" : "secondary"}>
                          {session.completed ? "Completed" : "Missed"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
