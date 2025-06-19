import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, User, Shield, Users, BarChart3, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SquadDetailsProps {
  playerId: number;
}

export default function SquadDetails({ playerId }: SquadDetailsProps) {
  const { data: player } = useQuery({
    queryKey: ["/api/players/1"],
  });

  const { data: squadMembers, isLoading: squadLoading } = useQuery({
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
                {coaches?.map((coach: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-purple-200">
                      {coach.picture ? (
                        <img 
                          src={coach.picture} 
                          alt={coach.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <User className="text-white w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{coach.name}</p>
                      <p className="text-xs text-purple-600 font-medium">{coach.role}</p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <User className="w-4 h-4 mr-2" />
                  Add Coach
                </Button>
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

          {/* Squad Members Section */}
          <div className="mt-6 mx-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Squad Members</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {squadMembers?.map((member: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/60 rounded-lg border border-orange-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-orange-200">
                    {member.picture ? (
                      <img 
                        src={member.picture} 
                        alt={member.memberName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <User className="text-white w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{member.memberName}</p>
                    <p className="text-xs text-orange-600 font-medium">{member.position}</p>
                    <p className="text-xs text-gray-500">{member.jerseyNumber}</p>
                  </div>
                </div>
              )) || (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No squad members added yet</p>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4 border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Squad Member
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
