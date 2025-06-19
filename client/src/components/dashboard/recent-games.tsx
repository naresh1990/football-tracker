import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Calendar, Goal, Circle, Clock, MapPin, Users } from "lucide-react";
import { formatShortDate, getGameResult } from "@/lib/utils";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecentGamesProps {
  playerId: number;
}

export default function RecentGames({ playerId }: RecentGamesProps) {
  const { data: games, isLoading } = useQuery({
    queryKey: ["/api/games/recent", { playerId, limit: 3 }],
  });

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
        <div>
        </div>
        <div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div>
        <div className="flex justify-end mb-4">
          <Link href="/games">
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-100 font-medium transition-all duration-200">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div>
          <div className="space-y-4">
            {games?.map((game: any, index: number) => {
              const result = getGameResult(game.teamScore, game.opponentScore);
              const resultIcon = result === 'win' ? Check : X;
              const resultColor = result === 'win' ? 'text-green-600' : 'text-red-600';
              const resultBg = result === 'win' ? 'bg-green-100' : 'bg-red-100';
              const cardBg = 'bg-white/80';

              return (
                <TooltipProvider key={game.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className={`p-6 ${cardBg} backdrop-blur-sm rounded-2xl hover:bg-white/70 transition-all duration-300 border border-white/50 shadow-sm`}
                  >
                    {/* Header with result and opponent */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 ${resultBg} rounded-2xl flex items-center justify-center shadow-md`}>
                          {React.createElement(resultIcon, { className: `${resultColor} w-7 h-7` })}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-xl">{game.opponent}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>{formatShortDate(game.date)}</span>
                          </div>
                        </div>
                      </div>
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
                    </div>

                    {/* Game Details */}
                    <div className="flex items-center justify-between">
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

                    {/* Additional game info if available */}
                    {(game.positionPlayed || game.minutesPlayed) && (
                      <div className="mt-4 pt-4 border-t border-gray-200/50">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          {game.positionPlayed && (
                            <span>Position: <span className="font-medium">{game.positionPlayed}</span></span>
                          )}
                          {game.minutesPlayed && (
                            <span>Minutes: <span className="font-medium">{game.minutesPlayed}'</span></span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
