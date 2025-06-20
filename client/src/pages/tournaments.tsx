import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Eye, Edit, Trophy, Calendar, Users, CheckCircle, XCircle, MinusCircle } from "lucide-react";
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

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ["/api/tournaments", { playerId }],
  });

  const { data: games = [] } = useQuery({
    queryKey: ['/api/games'],
  });

  // Calculate aggregated tournament data
  const tournamentsWithStats = tournaments.map((tournament: any) => {
    const tournamentGames = games.filter((game: any) => game.tournamentId === tournament.id);
    
    // Calculate total points earned
    const totalPointsEarned = tournamentGames.reduce((sum: number, game: any) => {
      return sum + (game.pointsEarned || 0);
    }, 0);
    
    // Calculate other stats
    const wins = tournamentGames.filter((game: any) => game.teamScore > game.opponentScore).length;
    const draws = tournamentGames.filter((game: any) => game.teamScore === game.opponentScore).length;
    const losses = tournamentGames.filter((game: any) => game.teamScore < game.opponentScore).length;
    const totalGames = tournamentGames.length;
    const winRate = totalGames > 0 ? `${Math.round((wins / totalGames) * 100)}%` : '0%';
    
    const teamGoalsScored = tournamentGames.reduce((sum: number, game: any) => sum + (game.teamScore || 0), 0);
    const playerGoalsScored = tournamentGames.reduce((sum: number, game: any) => sum + (game.playerGoals || 0), 0);
    
    return {
      ...tournament,
      points: totalPointsEarned,
      wins,
      draws,
      losses,
      winRate,
      teamGoalsScored,
      playerGoalsScored
    };
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
        {tournamentsWithStats && tournamentsWithStats.length === 0 ? (
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
            <motion.div 
              key={tournament.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Header Section with Logo */}
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-start gap-4">
                  {/* Tournament Logo */}
                  <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-3 border-white/30 bg-white/10 backdrop-blur-sm">
                    {tournament.logo ? (
                      <img 
                        src={tournament.logo} 
                        alt={`${tournament.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Trophy className="w-8 h-8 text-white/80" />
                    )}
                  </div>
                  
                  {/* Tournament Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white leading-tight mb-1 truncate">
                          {tournament.name}
                        </h3>
                        <p className="text-blue-100 text-sm leading-relaxed line-clamp-2">
                          {tournament.description}
                        </p>
                      </div>
                      <Badge 
                        className={`${getStatusColor(tournament.status)} text-xs px-3 py-1 font-semibold border-0 shadow-lg`}
                        variant="secondary"
                      >
                        {tournament.status}
                      </Badge>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 mt-3 text-blue-100 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {tournament.startDate ? formatDate(tournament.startDate) : 'TBD'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {tournament.matchFormat || 'TBD'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                    <div className="text-2xl font-bold text-blue-900 mb-1">
                      {tournament.currentPosition || 'TBD'}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Position</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
                    <div className="text-2xl font-bold text-green-900 mb-1">
                      {tournament.points}
                    </div>
                    <div className="text-xs text-green-600 font-medium">Points</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
                    <div className="text-2xl font-bold text-purple-900 mb-1">
                      {tournament.totalTeams || 'TBD'}
                    </div>
                    <div className="text-xs text-purple-600 font-medium">Teams</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/50">
                    <div className="text-2xl font-bold text-orange-900 mb-1">
                      {tournament.format || 'League'}
                    </div>
                    <div className="text-xs text-orange-600 font-medium">Format</div>
                  </div>
                </div>

                {/* Tournament Details */}
                <div className="bg-gray-50/50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    Tournament Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600">Venue:</span>
                      <span className="font-medium text-gray-900 text-right max-w-[180px] truncate" title={tournament.venue}>
                        {tournament.venue || 'TBD'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600">Goals Scored:</span>
                      <span className="font-medium text-gray-900">
                        {tournament.teamGoalsScored || 0} <span className="text-gray-500 text-xs">({tournament.playerGoalsScored || 0} by Darshil)</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600">Match Record:</span>
                      <span className="font-medium text-gray-900 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-green-700">{tournament.wins || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MinusCircle className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-600">{tournament.draws || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-red-500" />
                          <span className="text-red-600">{tournament.losses || 0}</span>
                        </div>
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600">Win Rate:</span>
                      <span className="font-medium text-gray-900">{tournament.winRate || '0%'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                    onClick={() => setLocation(`/tournament/${tournament.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <TournamentPointsForm 
                    tournament={tournament}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1 border-gray-300 hover:bg-gray-50 transition-all">
                        <Upload className="w-4 h-4 mr-2" />
                        Points Table
                      </Button>
                    }
                  />
                  <TournamentForm 
                    mode="edit"
                    tournament={tournament}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1 border-gray-300 hover:bg-gray-50 transition-all">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    }
                  />
                </div>
              </div>
            </motion.div>
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
