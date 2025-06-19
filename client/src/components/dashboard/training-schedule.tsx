import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Target, Zap } from "lucide-react";
import { formatShortDate, formatTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-gray-900">Training Schedule</CardTitle>
          <Button variant="ghost" size="sm" className="text-football-green hover:text-green-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming training sessions</p>
          ) : (
            sessions?.map((session: any) => {
              const Icon = getTrainingIcon(session.type);
              const colorClass = getTrainingColor(session.type);

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{session.type}</p>
                      <p className="text-sm text-gray-500">
                        {formatShortDate(session.date)}, {formatTime(session.date)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-football-green font-medium">
                    {session.duration} min
                  </span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
