import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Calendar, MapPin, Users, Trophy, Edit, Upload, Trash2, Goal, Circle, Clock, Award, Star, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate, getGameResult } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import GameForm from "@/components/forms/game-form";
import EditGameForm from "@/components/forms/edit-game-form";
import TournamentForm from "@/components/forms/tournament-form";
import TournamentPointsForm from "@/components/tournament/tournament-points-form";
import TournamentLogoUpload from "@/components/tournament/tournament-logo-upload";

export default function TournamentDetails() {
  const [, params] = useRoute("/tournament/:id");
  const tournamentId = parseInt(params?.id || "0");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedGames, setExpandedGames] = useState<Record<number, boolean>>({});

  const { data: tournament, isLoading: tournamentLoading } = useQuery({
    queryKey: ["/api/tournaments", tournamentId],
    queryFn: () => fetch(`/api/tournaments/${tournamentId}`).then(res => res.json()),
    enabled: !!tournamentId,
  });

  const { data: games } = useQuery({
    queryKey: ["/api/games", { playerId: 1 }],
    enabled: !!tournamentId,
  });

  const deleteGameMutation = useMutation({
    mutationFn: (gameId: number) => apiRequest("DELETE", `/api/games/${gameId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/summary"] });
      toast({
        title: "Success",
        description: "Game deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete game",
        variant: "destructive",
      });
    },
  });

  // Filter games for this tournament
  const tournamentGames = games?.filter((game: any) => game.tournamentId === tournamentId) || [];
  
  // Group games by stage
  const gamesByStage = tournamentGames.reduce((acc: any, game: any) => {
    const stage = game.tournamentStage || 'unassigned';
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(game);
    return acc;
  }, {});

  const stageOrder = ['league', 'knockout', 'round-of-16', 'quarter-final', 'semi-final', 'final', 'unassigned'];
  const stageLabels: { [key: string]: string } = {
    'league': 'League Stage',
    'knockout': 'Knockout Round',
    'round-of-16': 'Round of 16',
    'quarter-final': 'Quarter Final',
    'semi-final': 'Semi Final',
    'final': 'Final',
    'unassigned': 'Unassigned Games'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-600 text-white';
      case 'completed':
        return 'bg-green-600 text-white';
      case 'upcoming':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (tournamentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tournament Not Found</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
        </div>

        {/* Tournament Info Card */}
        <Card className="mb-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Header Section with Logo */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-start gap-4">
              {/* Tournament Logo */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-3 border-white/30 bg-white/10 backdrop-blur-sm">
                {tournament.logo ? (
                  <img 
                    src={tournament.logo} 
                    alt={`${tournament.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Trophy className="w-10 h-10 text-white/80" />
                )}
              </div>
              
              {/* Tournament Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                      {tournament.name}
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed mb-4">
                      {tournament.description}
                    </p>
                    
                    {/* Tournament Details */}
                    <div className="flex items-center gap-6 text-blue-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">
                          {tournament.startDate ? formatDate(tournament.startDate) : 'TBD'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">{tournament.venue || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">{tournament.matchFormat || 'TBD'}</span>
                      </div>
                      <Badge 
                        className={`${getStatusColor(tournament.status)} text-xs px-3 py-1 font-semibold border-0 shadow-lg`}
                        variant="secondary"
                      >
                        {tournament.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="p-6 bg-white/50">
            <div className="flex gap-2 flex-wrap">
              <TournamentForm 
                mode="edit"
                tournament={tournament}
                trigger={
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Tournament
                  </Button>
                }
              />
              <TournamentLogoUpload 
                tournament={tournament}
                trigger={
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Edit Logo
                  </Button>
                }
              />
              <TournamentPointsForm 
                tournament={tournament}
                trigger={
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Points Table
                  </Button>
                }
              />
            </div>
          </div>
        </Card>

        {/* Tournament Stages */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Tournament Stages</h2>
            <GameForm 
              tournament={tournament}
              trigger={
                <Button className="text-[#ffffff]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Game
                </Button>
              }
            />
          </div>

          {stageOrder.map(stage => {
            const stageGames = gamesByStage[stage];
            if (!stageGames || stageGames.length === 0) return null;

            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{stageLabels[stage]}</h3>
                  <Badge variant="secondary" className="text-xs text-[#ffffff]">
                    {stageGames.length} {stageGames.length === 1 ? 'game' : 'games'}
                  </Badge>
                </div>

                <div className="grid gap-4">
                  {stageGames.map((game: any) => {
                    const result = getGameResult(game.teamScore, game.opponentScore);
                    const isExpanded = expandedGames[game.id] || false;
                    
                    return (
                      <Card key={game.id} className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                        <CardContent className="p-0">
                          {/* Header with Tournament Logo */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Trophy className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-lg">vs {game.opponent}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-600">{tournament.name}</span>
                                    <span className="text-xs text-gray-500">• {game.matchFormat || tournament.matchFormat}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Centered Score Card */}
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <div className="text-sm font-medium text-gray-600 mb-1">Darshil's Team</div>
                                  <div className="text-2xl font-bold text-gray-900">{game.teamScore}</div>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="text-lg font-bold text-gray-400 mb-1">VS</div>
                                  <div className={`px-3 py-1 rounded-lg font-bold text-sm shadow-lg border-2 ${
                                    result === 'win' ? 'bg-green-600 text-white border-green-700 shadow-green-200' :
                                    result === 'loss' ? 'bg-red-600 text-white border-red-700 shadow-red-200' :
                                    result === 'draw' ? 'bg-gray-600 text-white border-gray-700 shadow-gray-200' :
                                    'bg-gray-500 text-white border-gray-600 shadow-gray-200'
                                  }`}>
                                    {result.charAt(0).toUpperCase() + result.slice(1)}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-medium text-gray-600 mb-1">{game.opponent}</div>
                                  <div className="text-2xl font-bold text-gray-900">{game.opponentScore}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedGames(prev => ({
                                    ...prev,
                                    [game.id]: !isExpanded
                                  }))}
                                  className="h-8 w-8 p-0"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>
                                <EditGameForm game={game} tournament={tournament} />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this game?")) {
                                      deleteGameMutation.mutate(game.id);
                                    }
                                  }}
                                  disabled={deleteGameMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Collapsible Content */}
                          {isExpanded && (
                            <div className="p-4 border-t border-gray-100">
                              {/* Performance Stats */}
                              <div className="grid grid-cols-4 gap-4 mb-4">
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                  <Goal className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                  <div className="text-xl font-bold text-green-800">{game.playerGoals}</div>
                                  <div className="text-xs text-green-600">Goals</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                  <Circle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                  <div className="text-xl font-bold text-blue-800">{game.playerAssists}</div>
                                  <div className="text-xs text-blue-600">Assists</div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                  <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                                  <div className="text-xl font-bold text-purple-800">{game.minutesPlayed}</div>
                                  <div className="text-xs text-purple-600">Minutes</div>
                                </div>
                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                  <Star className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                                  <div className="text-xl font-bold text-orange-800">{game.rating || 'N/A'}</div>
                                  <div className="text-xs text-orange-600">Rating</div>
                                </div>
                              </div>

                              {/* Match Details */}
                              <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(game.date)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {game.venue || tournament.venue || 'TBD'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="w-4 h-4" />
                                  {game.positionPlayed || 'N/A'}
                                </div>
                              </div>

                              {/* Notes Section */}
                              {game.notes && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                                  <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
                                  <div className="text-sm text-gray-600">{game.notes}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {Object.keys(gamesByStage).length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No games added yet</h3>
              <p className="text-gray-600 mb-4">Start adding games to track your tournament progress</p>
              <GameForm 
                tournament={tournament}
                trigger={
                  <Button className="text-[#ffffff]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Game
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}