import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trophy, Eye, Calendar, Target, Upload, Users } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface TournamentTrackingProps {
  playerId: number;
}

export default function TournamentTracking({ playerId }: TournamentTrackingProps) {
  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["/api/tournaments", { playerId }],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <div>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section>
      <div>
        
        <div>
          <div className="space-y-4">
            {tournaments?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No tournaments found</p>
              </div>
            ) : (
              tournaments?.map((tournament: any) => (
                <div key={tournament.id} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                        <p className="text-blue-100 text-sm">{tournament.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {tournament.status}
                    </Badge>
                  </div>

                  {/* Date and Format */}
                  <div className="flex items-center gap-4 mb-6 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatShortDate(tournament.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{tournament.matchFormat || '5v5'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">{tournament.venue}</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">{tournament.currentPosition || '-'}</div>
                      <div className="text-xs text-blue-100">Position</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">{tournament.totalPoints || 0}</div>
                      <div className="text-xs text-blue-100">Points</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <div className="text-xs text-blue-100 mb-2">Darshil's Stats</div>
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{tournament.playerGoals || 0}</div>
                          <div className="text-xs text-green-200">Goals</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{tournament.playerAssists || 0}</div>
                          <div className="text-xs text-orange-200">Assists</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <div className="text-xs text-blue-100 mb-2">Match Record</div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-300">{tournament.totalWins || 0}W</span>
                        <span className="text-gray-300">{tournament.totalDraws || 0}D</span>
                        <span className="text-red-300">{tournament.totalLosses || 0}L</span>
                      </div>
                      <div className="text-center mt-1">
                        <span className="text-xs text-blue-200">{tournament.totalGames || 0} Games</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                    onClick={() => window.location.href = `/tournaments/${tournament.id}`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Tournament Details
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
