import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight } from "lucide-react";
import { formatShortDate, getGameResult } from "@/lib/utils";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentGamesProps {
  playerId: number;
}

export default function RecentGames({ playerId }: RecentGamesProps) {
  const { data: games, isLoading } = useQuery({
    queryKey: ["/api/games/recent", { playerId, limit: 3 }],
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-900">Recent Games</CardTitle>
            <Link href="/games">
              <Button variant="ghost" className="text-football-green hover:text-green-700 font-medium">
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {games?.map((game: any) => {
              const result = getGameResult(game.teamScore, game.opponentScore);
              const resultIcon = result === 'win' ? Check : X;
              const resultColor = result === 'win' ? 'text-green-600' : 'text-red-600';
              const resultBg = result === 'win' ? 'bg-green-100' : 'bg-red-100';

              return (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${resultBg} rounded-full flex items-center justify-center`}>
                      {React.createElement(resultIcon, { className: `${resultColor} w-5 h-5` })}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{game.opponent}</p>
                      <p className="text-sm text-gray-500">{formatShortDate(game.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {game.teamScore}-{game.opponentScore}
                    </p>
                    <div className="flex items-center space-x-3 text-sm">
                      {game.playerGoals > 0 && (
                        <span className="text-football-green">{game.playerGoals} goals</span>
                      )}
                      {game.playerAssists > 0 && (
                        <span className="text-trophy-gold">{game.playerAssists} assists</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
