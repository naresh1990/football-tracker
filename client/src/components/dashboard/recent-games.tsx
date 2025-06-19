import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Calendar, Trophy, Target } from "lucide-react";
import { formatShortDate, getGameResult } from "@/lib/utils";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Recent Games</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Recent Games</CardTitle>
            </div>
            <Link href="/games">
              <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-100 font-medium transition-all duration-200">
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {games?.map((game: any, index: number) => {
              const result = getGameResult(game.teamScore, game.opponentScore);
              const resultIcon = result === 'win' ? Check : X;
              const resultColor = result === 'win' ? 'text-green-600' : 'text-red-600';
              const resultBg = result === 'win' ? 'bg-green-100' : 'bg-red-100';
              const cardBg = result === 'win' ? 'bg-green-50/50' : 'bg-red-50/50';

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className={`flex items-center justify-between p-5 ${cardBg} backdrop-blur-sm rounded-2xl hover:bg-white/70 transition-all duration-300 border border-white/50 shadow-sm`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 ${resultBg} rounded-2xl flex items-center justify-center shadow-md`}>
                      {React.createElement(resultIcon, { className: `${resultColor} w-6 h-6` })}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{game.opponent}</p>
                      <p className="text-sm text-gray-600 font-medium">{formatShortDate(game.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-2xl mb-1">
                      {game.teamScore}-{game.opponentScore}
                    </p>
                    <div className="flex items-center justify-end space-x-4 text-sm">
                      {game.playerGoals > 0 && (
                        <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
                          <Trophy className="w-3 h-3 text-green-600" />
                          <span className="text-green-700 font-semibold">{game.playerGoals}</span>
                        </div>
                      )}
                      {game.playerAssists > 0 && (
                        <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-lg">
                          <Target className="w-3 h-3 text-orange-600" />
                          <span className="text-orange-700 font-semibold">{game.playerAssists}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
