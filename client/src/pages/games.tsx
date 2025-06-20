import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Check, X, Calendar, MapPin, Users, Clock, Goal, Circle, Trophy, Star, Award, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate, getGameResult } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import GameForm from "@/components/forms/game-form";
import EditGameForm from "@/components/forms/edit-game-form";

export default function Games() {
  const playerId = 1;
  const { toast } = useToast();
  const [expandedGames, setExpandedGames] = useState<Record<number, boolean>>({});

  const { data: games, isLoading } = useQuery({
    queryKey: ["/api/games", { playerId }],
  });

  const { data: tournaments } = useQuery({
    queryKey: ["/api/tournaments", { playerId }],
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
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fixtures & Results</h1>
            <p className="text-gray-600">Track your match performance and statistics</p>
          </div>
          <GameForm 
            trigger={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Game
              </Button>
            }
          />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Games</h1>
          <GameForm />
        </div>

        <Card>
        <CardContent className="p-0">
          <div className="space-y-6 p-6">
            {games && games.length === 0 ? (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No games recorded yet</h3>
                <p className="text-gray-600 mb-6">Start tracking your football matches and performance</p>
                <GameForm trigger={
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 font-bold px-4 py-2 w-auto inline-flex items-center whitespace-nowrap"
                    style={{ color: 'white' }}
                  >
                    <Plus className="mr-2 h-4 w-4 text-white" />
                    <span className="text-white">Add Your First Game</span>
                  </Button>
                } />
              </motion.div>
            ) : games && games.length > 0 ? (
              games?.map((game: any, index: number) => {
                const result = getGameResult(game.teamScore, game.opponentScore);
                const tournament = tournaments?.find((t: any) => t.id === game.tournamentId);
                
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
                                <span className="text-xs text-gray-600">{tournament?.name || game.gameType}</span>
                                <span className="text-xs text-gray-500">• {game.matchFormat}</span>
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
                        <EditGameForm 
                          game={game} 
                          tournament={tournament} 
                        />
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
                              {game.venue || 'TBD'}
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
              })
                            </div>
                          )}
                          {game.yellowCards && (
                            <div className="text-center bg-yellow-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-yellow-700">{game.yellowCards}</div>
                              <div className="text-xs text-yellow-600">Yellow</div>
                            </div>
                          )}
                          {game.redCards && (
                            <div className="text-center bg-red-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-red-700">{game.redCards}</div>
                              <div className="text-xs text-red-600">Red</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : null}
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
