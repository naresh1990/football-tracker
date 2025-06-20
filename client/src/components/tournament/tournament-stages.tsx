import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, MapPin, Users, Plus } from "lucide-react";
import { formatDate, getGameResult } from "@/lib/utils";
import { motion } from "framer-motion";
import GameForm from "@/components/forms/game-form";

interface TournamentStagesProps {
  tournament: any;
}

export default function TournamentStages({ tournament }: TournamentStagesProps) {
  const { data: games } = useQuery({
    queryKey: ["/api/games", { playerId: 1 }],
  });

  // Filter games for this tournament
  const tournamentGames = games?.filter((game: any) => game.tournamentId === tournament.id) || [];
  
  console.log('Tournament component - Tournament ID:', tournament.id);
  console.log('Tournament component - All games:', games);
  console.log('Tournament component - Tournament games:', tournamentGames);

  // Group games by stage
  const gamesByStage = tournamentGames.reduce((acc: any, game: any) => {
    const stage = game.tournamentStage || 'unassigned';
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(game);
    return acc;
  }, {});
  
  console.log('Tournament component - Games by stage:', gamesByStage);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tournament Stages</h2>
        <GameForm 
          tournament={tournament}
          trigger={
            <Button>
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
              <Badge variant="secondary" className="text-xs">
                {stageGames.length} {stageGames.length === 1 ? 'game' : 'games'}
              </Badge>
            </div>

            <div className="grid gap-4">
              {stageGames.map((game: any) => {
                const result = getGameResult(game.teamScore, game.opponentScore);
                return (
                  <Card key={game.id} className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white/90 transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-gray-900">vs {game.opponent}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result === 'Win' ? 'bg-green-100 text-green-800' :
                              result === 'Loss' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(game.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {game.venue || tournament.venue || 'TBD'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {game.matchFormat || tournament.matchFormat}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-2xl text-gray-900">
                            {game.teamScore}-{game.opponentScore}
                          </div>
                          <div className="text-sm text-gray-600">
                            Goals: {game.playerGoals} | Assists: {game.playerAssists}
                          </div>
                        </div>
                      </div>
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
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add First Game
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}