import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Calendar, Goal, Circle, Clock, MapPin, Users, Trophy } from "lucide-react";
import { formatShortDate, getGameResult } from "@/lib/utils";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import EmptyState from "@/components/ui/empty-state";

interface RecentGamesProps {
  playerId: number;
}

export default function RecentGames({ playerId }: RecentGamesProps) {
  const { data: allGames, isLoading } = useQuery({
    queryKey: ["/api/games/recent", { playerId }],
  });

  // Limit to last 3 games
  const games = allGames ? allGames.slice(0, 3) : [];

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
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/90 transition-all duration-300 border border-white/50 shadow-sm"
                >
                  {/* Compact horizontal layout with consistent positioning */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    {/* Left side - Tournament info and opponent (4 columns) */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className={`w-10 h-10 ${resultBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        {React.createElement(resultIcon, { className: `${resultColor} w-5 h-5` })}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          vs {game.opponent}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>Blue Cubs Bangalore 2024</span>
                          <span>•</span>
                          <span>5v5</span>
                        </div>
                      </div>
                    </div>

                    {/* Center - Score (4 columns) */}
                    <div className="col-span-4 flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Darshil's Team</div>
                        <div className="text-2xl font-bold text-gray-900">{game.teamScore}</div>
                      </div>
                      <div className="text-sm text-gray-400 font-medium">VS</div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">{game.opponent}</div>
                        <div className="text-2xl font-bold text-gray-900">{game.opponentScore}</div>
                      </div>
                    </div>

                    {/* Right side - Result and date/stats (4 columns) */}
                    <div className="col-span-4 flex items-center justify-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result === 'win' ? 'bg-green-500 text-white' : 
                        result === 'loss' ? 'bg-red-500 text-white' : 
                        'bg-gray-500 text-white'
                      }`}>
                        {result === 'win' ? 'Win' : result === 'loss' ? 'Loss' : 'Draw'}
                      </span>
                      
                      {/* Date and Player stats stacked */}
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          {formatShortDate(game.date)}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          {game.playerGoals > 0 && (
                            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
                              <Goal className="w-3 h-3 text-green-600" />
                              <span className="text-green-700 font-semibold text-sm">{game.playerGoals}</span>
                            </div>
                          )}
                          {game.playerAssists > 0 && (
                            <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-lg">
                              <Circle className="w-3 h-3 text-orange-600" />
                              <span className="text-orange-700 font-semibold text-sm">{game.playerAssists}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
