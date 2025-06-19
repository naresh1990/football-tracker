import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { formatDate, getGameResult } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Games</h1>
        <Button className="bg-football-green hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {games?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No games recorded yet</p>
              </div>
            ) : (
              games?.map((game: any) => {
                const result = getGameResult(game.teamScore, game.opponentScore);
                const resultIcon = result === 'win' ? Check : X;
                const resultColor = result === 'win' ? 'text-green-600' : 'text-red-600';
                const resultBg = result === 'win' ? 'bg-green-100' : 'bg-red-100';

                return (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${resultBg} rounded-full flex items-center justify-center`}>
                        {React.createElement(resultIcon, { className: `${resultColor} w-5 h-5` })}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{game.opponent}</p>
                        <p className="text-sm text-gray-500">{formatDate(game.date)}</p>
                        <p className="text-xs text-gray-400">Position: {game.positionPlayed}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="font-bold text-gray-900 text-lg">
                          {game.teamScore}-{game.opponentScore}
                        </p>
                        <div className="flex items-center space-x-3 text-sm">
                          {game.playerGoals > 0 && (
                            <span className="text-football-green font-medium">
                              {game.playerGoals} goals
                            </span>
                          )}
                          {game.playerAssists > 0 && (
                            <span className="text-trophy-gold font-medium">
                              {game.playerAssists} assists
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGameMutation.mutate(game.id)}
                          disabled={deleteGameMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
