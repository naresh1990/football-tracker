import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trophy, Eye, Calendar, Target, Upload } from "lucide-react";
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
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex justify-end mb-4">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments?.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">No tournaments found</p>
              </div>
            ) : (
              tournaments?.map((tournament: any) => (
                <div key={tournament.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-900">{tournament.name}</h4>
                    <Badge className={getStatusColor(tournament.status)} variant="secondary">
                      {tournament.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tournament.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {tournament.currentPosition && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Position:</span>
                        <span className="font-medium">{tournament.currentPosition} Place</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Games Played:</span>
                      <span className="font-medium">
                        {tournament.gamesPlayed}/{tournament.totalGames || '?'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Points:</span>
                      <span className="font-medium">{tournament.points} pts</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm" className="text-football-green hover:text-green-700">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Points Table
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
