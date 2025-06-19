import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, User, Shield, Users, BarChart3, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SquadDetailsProps {
  playerId: number;
  activeClub?: any;
  coaches?: any[];
  squadMembers?: any[];
}

export default function SquadDetails({ playerId, activeClub, coaches, squadMembers }: SquadDetailsProps) {
  const { data: player } = useQuery({
    queryKey: ["/api/players/1"],
  });

  // Use actual coaches and squad members passed as props

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
                  <span className="font-semibold text-gray-900">{activeClub?.name || 'No Active Club'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600 text-sm">Squad Level:</span>
                  <span className="font-semibold text-gray-900">{activeClub?.squadLevel || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600 text-sm">Season:</span>
                  <span className="font-semibold text-gray-900">
                    {activeClub && activeClub.seasonStart && activeClub.seasonEnd 
                      ? `${new Date(activeClub.seasonStart).getFullYear()}-${new Date(activeClub.seasonEnd).getFullYear().toString().slice(2)}`
                      : 'Current Season'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 text-sm">Status:</span>
                  <span className="font-semibold text-gray-900">
                    {activeClub?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
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
                {coaches && coaches.length > 0 ? (
                  coaches.filter(coach => coach.clubId === activeClub?.id).map((coach: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-purple-200">
                        {coach.profilePicture ? (
                          <img 
                            src={coach.profilePicture} 
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
                        <p className="text-xs text-purple-600 font-medium">{coach.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No coaches assigned</p>
                  </div>
                )}
              </div>
            </div>

            {/* Squad Overview */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Squad Overview</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-green-100">
                  <span className="text-gray-600 text-sm">Total Players:</span>
                  <span className="font-semibold text-gray-900">
                    {squadMembers ? squadMembers.filter(member => member.clubId === activeClub?.id).length : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-green-100">
                  <span className="text-gray-600 text-sm">Average Age:</span>
                  <span className="font-semibold text-gray-900">
                    {squadMembers && squadMembers.length > 0 
                      ? `${Math.round(squadMembers.filter(member => member.clubId === activeClub?.id && member.age).reduce((sum, member) => sum + member.age, 0) / squadMembers.filter(member => member.clubId === activeClub?.id && member.age).length || 0)} years`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-green-100">
                  <span className="text-gray-600 text-sm">Head Coach:</span>
                  <span className="font-semibold text-gray-900">
                    {coaches && coaches.length > 0 
                      ? coaches.find(coach => coach.clubId === activeClub?.id && coach.title === 'Head Coach')?.name || 
                        coaches.find(coach => coach.clubId === activeClub?.id)?.name || 'Not assigned'
                      : 'Not assigned'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 text-sm">Jersey #:</span>
                  <span className="font-semibold text-gray-900">
                    {squadMembers 
                      ? squadMembers.find(member => member.name === 'Darshil Podishetty')?.jerseyNumber || '#9'
                      : '#9'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
