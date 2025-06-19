import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Check, X, Calendar, MapPin, Users, Clock, Goal, Circle, Trophy } from "lucide-react";
import { formatDate, getGameResult } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import GameForm from "@/components/forms/game-form";

export default function Games() {
  const playerId = 1;
  const { toast } = useToast();

  const { data: games, isLoading } = useQuery({
    queryKey: ["/api/games", { playerId }],
  });

  const deleteGameMutation = useMutation({
    mutationFn: (gameId: number) => apiRequest("DELETE", `/api/games/${gameId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
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
          <h1 className="text-3xl font-bold text-gray-900">Games</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Game
          </Button>
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
                const resultIcon = result === 'win' ? Check : X;
                const resultColor = result === 'win' ? 'text-green-600' : 'text-red-600';
                const resultBg = result === 'win' ? 'bg-green-100' : 'bg-red-100';

                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 border border-white/50 shadow-sm"
                  >
                    {/* Header with result and opponent */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 ${resultBg} rounded-2xl flex items-center justify-center shadow-md`}>
                          {React.createElement(resultIcon, { className: `${resultColor} w-7 h-7` })}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-xl">vs {game.opponent}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(game.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="text-right">
                          <p className="font-black text-gray-900 text-3xl mb-1">
                            {game.teamScore}-{game.opponentScore}
                          </p>
                          <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                            result === 'win' ? 'bg-green-100 text-green-700' : 
                            result === 'loss' ? 'bg-red-100 text-red-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {result === 'win' ? 'Victory' : result === 'loss' ? 'Defeat' : 'Draw'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => deleteGameMutation.mutate(game.id)}
                            disabled={deleteGameMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Game Details */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{game.venue || 'Home'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{game.gameType || 'League'}</span>
                        </div>
                        {game.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{game.duration} min</span>
                          </div>
                        )}
                        {game.matchFormat && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{game.matchFormat}</span>
                          </div>
                        )}
                      </div>

                      {/* Player Performance */}
                      <div className="flex items-center space-x-3">
                        {game.playerGoals > 0 && (
                          <div 
                            className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-lg cursor-help relative group"
                            title="Goals scored by Darshil in this game"
                          >
                            <Goal className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-semibold">{game.playerGoals}</span>
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                              Goals scored by Darshil
                            </div>
                          </div>
                        )}
                        {game.playerAssists > 0 && (
                          <div 
                            className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-lg cursor-help relative group"
                            title="Assists made by Darshil in this game"
                          >
                            <Circle className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-700 font-semibold">{game.playerAssists}</span>
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                              Assists made by Darshil
                            </div>
                          </div>
                        )}
                        {game.playerGoals === 0 && game.playerAssists === 0 && (
                          <span className="text-xs text-gray-500 italic">No goals or assists</span>
                        )}
                      </div>
                    </div>

                    {/* Additional game info */}
                    {(game.positionPlayed || game.minutesPlayed || game.notes) && (
                      <div className="mt-4 pt-4 border-t border-gray-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(game.positionPlayed || game.minutesPlayed) && (
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              {game.positionPlayed && (
                                <span>Position: <span className="font-medium">{game.positionPlayed}</span></span>
                              )}
                              {game.minutesPlayed && (
                                <span>Minutes: <span className="font-medium">{game.minutesPlayed}'</span></span>
                              )}
                            </div>
                          )}
                          {game.notes && (
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Notes:</span> <span className="italic">{game.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Performance Stats if available */}
                    {(game.shots || game.saves || game.fouls || game.yellowCards || game.redCards) && (
                      <div className="mt-4 pt-4 border-t border-gray-200/50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Match Statistics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                          {game.shots && (
                            <div className="text-center bg-gray-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-gray-900">{game.shots}</div>
                              <div className="text-xs text-gray-600">Shots</div>
                            </div>
                          )}
                          {game.saves && (
                            <div className="text-center bg-gray-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-gray-900">{game.saves}</div>
                              <div className="text-xs text-gray-600">Saves</div>
                            </div>
                          )}
                          {game.fouls && (
                            <div className="text-center bg-gray-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-gray-900">{game.fouls}</div>
                              <div className="text-xs text-gray-600">Fouls</div>
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
