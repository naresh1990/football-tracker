import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, User, Shield, Users, BarChart3 } from "lucide-react";
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
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Team Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Team Information</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600 text-sm">Team:</span>
                  <span className="font-semibold text-gray-900">Sporthood</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600 text-sm">Division:</span>
                  <span className="font-semibold text-gray-900">U10 Elite</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 text-sm">Jersey:</span>
                  <span className="font-semibold text-gray-900">#9</span>
                </div>
              </div>
            </div>

            {/* Coaching Staff */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Coaching Staff</h4>
              </div>
              <div className="space-y-4">
                {defaultCoaches.map((coach: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                      <User className="text-white w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{coach.name}</p>
                      <p className="text-xs text-purple-600 font-medium">{coach.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Season Stats */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Season Stats</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-green-100">
                  <span className="text-gray-600 text-sm">Games Played:</span>
                  <span className="font-semibold text-gray-900">18</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-green-100">
                  <span className="text-gray-600 text-sm">Minutes Played:</span>
                  <span className="font-semibold text-gray-900">1,440</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-green-100">
                  <span className="text-gray-600 text-sm">Avg Rating:</span>
                  <span className="font-semibold text-gray-900">8.2/10</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 text-sm">Team Wins:</span>
                  <span className="font-semibold text-gray-900">14</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
