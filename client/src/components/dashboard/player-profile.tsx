import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface PlayerProfileProps {
  player: any;
  stats: any;
}

export default function PlayerProfile({ player, stats }: PlayerProfileProps) {
  if (!player || !stats) return null;

  return (
    <section>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-gradient-to-br from-football-green to-field-green rounded-full flex items-center justify-center">
                <User className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
                <p className="text-gray-600">{player.position}</p>
                <p className="text-sm text-gray-500">
                  {player.teamName} • Age {player.age}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-football-green">
                  {stats.totalGoals}
                </div>
                <div className="text-sm text-gray-600">Goals</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-football-green">
                  {stats.totalAssists}
                </div>
                <div className="text-sm text-gray-600">Assists</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-football-green">
                  {stats.totalGames}
                </div>
                <div className="text-sm text-gray-600">Games</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
