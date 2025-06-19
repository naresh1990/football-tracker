import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SquadDetailsProps {
  playerId: number;
}

export default function SquadDetails({ playerId }: SquadDetailsProps) {
  const { data: player } = useQuery({
    queryKey: ["/api/players/1"],
  });

  const { data: squad, isLoading: squadLoading } = useQuery({
    queryKey: ["/api/squad", { playerId }],
  });

  const { data: coaches, isLoading: coachesLoading } = useQuery({
    queryKey: ["/api/coaching-staff", { playerId }],
  });

  if (squadLoading || coachesLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Squad Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock coaching staff if none exists
  const defaultCoaches = coaches?.length > 0 ? coaches : [
    { name: "Coach Martinez", role: "Head Coach" },
    { name: "Coach Thompson", role: "Assistant Coach" }
  ];

  return (
    <section>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-900">Squad Details</CardTitle>
            <Button variant="ghost" size="sm" className="text-football-green hover:text-green-700">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Team Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Team Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Team:</span>
                  <span className="font-medium">{player?.teamName || 'Lions FC'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Division:</span>
                  <span className="font-medium">{player?.division || 'U12 Premier'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jersey Number:</span>
                  <span className="font-medium">{player?.jerseyNumber || '#10'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Captain:</span>
                  <span className="font-medium">{player?.isCaptain ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Coaching Staff */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Coaching Staff</h4>
              <div className="space-y-3">
                {defaultCoaches.map((coach: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-football-green rounded-full flex items-center justify-center">
                      <User className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{coach.name}</p>
                      <p className="text-xs text-gray-500">{coach.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Season Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Season Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Games Played:</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minutes Played:</span>
                  <span className="font-medium">1,440</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Rating:</span>
                  <span className="font-medium">8.2/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Team Wins:</span>
                  <span className="font-medium">14</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
