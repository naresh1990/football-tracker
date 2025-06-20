import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Eye, Edit, Trophy, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import TournamentForm from "@/components/forms/tournament-form";
import TournamentPointsForm from "@/components/tournament/tournament-points-form";
import GameForm from "@/components/forms/game-form";
import TournamentStages from "@/components/tournament/tournament-stages";

export default function Tournaments() {
  const playerId = 1;
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [, setLocation] = useLocation();

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
          <TournamentForm 
            trigger={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Tournament
              </Button>
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
          <TournamentForm />
        </div>

        <div className="space-y-4">
        {tournaments && tournaments.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournaments yet</h3>
            <p className="text-gray-600 mb-6">Join tournaments to compete and track your progress</p>
            <TournamentForm trigger={
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600 font-bold px-4 py-2 w-auto inline-flex items-center whitespace-nowrap"
                style={{ color: 'white' }}
              >
                <Plus className="mr-2 h-4 w-4 text-white" />
                <span className="text-white">Add Tournament</span>
              </Button>
            } />
          </motion.div>
        ) : tournaments && tournaments.length > 0 ? (
          tournaments?.map((tournament: any) => (
            <div key={tournament.id} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:bg-white/90 transition-all duration-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">{tournament.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{tournament.description}</p>
                </div>
                <Badge className={`text-xs px-3 py-1 font-medium ${getStatusColor(tournament.status)}`} variant="secondary">
                  {tournament.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{tournament.currentPosition || 'TBD'}</div>
                  <div className="text-xs text-gray-600">Position</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{tournament.gamesPlayed}/{tournament.totalGames || '?'}</div>
                  <div className="text-xs text-gray-600">Games Played</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{tournament.points}</div>
                  <div className="text-xs text-gray-600">Points</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{tournament.startDate ? formatDate(tournament.startDate) : 'TBD'}</div>
                  <div className="text-xs text-gray-600">Start Date</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Tournament Details</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">{tournament.format || 'League'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Match Format:</span>
                      <span className="font-medium">{tournament.matchFormat || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Teams:</span>
                      <span className="font-medium">{tournament.totalTeams || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue:</span>
                      <span className="font-medium">{tournament.venue || 'TBD'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Performance</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Goals Scored:</span>
                      <span className="font-medium">{tournament.goalsScored || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Goals Conceded:</span>
                      <span className="font-medium">{tournament.goalsConceded || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Win Rate:</span>
                      <span className="font-medium">{tournament.winRate || '0%'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setLocation(`/tournament/${tournament.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <TournamentPointsForm 
                  tournament={tournament}
                  trigger={
                    <Button variant="ghost" size="sm" className="flex-1 justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                      <Upload className="w-4 h-4 mr-2" />
                      Points Table
                    </Button>
                  }
                />
                <TournamentForm 
                  mode="edit"
                  tournament={tournament}
                  trigger={
                    <Button variant="ghost" size="sm" className="flex-1 justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  }
                />
              </div>
            </div>
          ))
        ) : null}
        </div>

        {/* Tournament Stages Modal/View */}
        {selectedTournament && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTournament.name}</h2>
                  <p className="text-gray-600">{selectedTournament.description}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedTournament(null)}>
                  ✕
                </Button>
              </div>
              <div className="p-6">
                <TournamentStages tournament={selectedTournament} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
