import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface BracketMatch {
  id: number;
  round: string;
  matchNumber: number;
  team1: string | null;
  team2: string | null;
  team1Score: number | null;
  team2Score: number | null;
  winner: string | null;
  status: string;
  scheduledDate: string | null;
  venue: string | null;
  nextMatchId: number | null;
}

interface TournamentBracketProps {
  tournament: any;
  matches: BracketMatch[];
  onMatchUpdate?: (matchId: number, data: any) => void;
}

export default function TournamentBracket({ tournament, matches, onMatchUpdate }: TournamentBracketProps) {
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null);

  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<string, BracketMatch[]>);

  // Define round order and display names
  const roundOrder = ['round-of-16', 'quarter-final', 'semi-final', 'final'];
  const roundNames = {
    'round-of-16': 'Round of 16',
    'quarter-final': 'Quarter Final',
    'semi-final': 'Semi Final',
    'final': 'Final'
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getWinnerHighlight = (team: string | null, winner: string | null) => {
    if (!team || !winner) return '';
    return team === winner ? 'bg-green-50 border-green-300 font-bold' : 'bg-red-50 border-red-200';
  };

  const renderMatch = (match: BracketMatch, index: number) => (
    <motion.div
      key={match.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative"
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-gray-200"
            onClick={() => setSelectedMatch(match)}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Match Header */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-gray-500">
                Match {match.matchNumber}
              </div>
              <Badge className={`text-xs ${getMatchStatusColor(match.status)}`}>
                {match.status}
              </Badge>
            </div>

            {/* Teams */}
            <div className="space-y-2">
              <div className={`flex items-center justify-between p-2 rounded-lg border-2 ${getWinnerHighlight(match.team1, match.winner)}`}>
                <span className="font-medium text-sm">
                  {match.team1 || 'TBD'}
                </span>
                <span className="text-lg font-bold">
                  {match.team1Score !== null ? match.team1Score : '-'}
                </span>
              </div>
              
              <div className="text-center text-xs text-gray-400 font-medium">VS</div>
              
              <div className={`flex items-center justify-between p-2 rounded-lg border-2 ${getWinnerHighlight(match.team2, match.winner)}`}>
                <span className="font-medium text-sm">
                  {match.team2 || 'TBD'}
                </span>
                <span className="text-lg font-bold">
                  {match.team2Score !== null ? match.team2Score : '-'}
                </span>
              </div>
            </div>

            {/* Match Details */}
            {(match.scheduledDate || match.venue) && (
              <div className="border-t pt-2 mt-2">
                {match.scheduledDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(match.scheduledDate).toLocaleDateString()}</span>
                  </div>
                )}
                {match.venue && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{match.venue}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection Lines */}
      {match.nextMatchId && (
        <div className="absolute top-1/2 right-0 w-8 h-0.5 bg-gray-300 transform translate-x-full -translate-y-px"></div>
      )}
    </motion.div>
  );

  const renderRound = (roundKey: string, matches: BracketMatch[]) => (
    <div key={roundKey} className="flex flex-col items-center space-y-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        {roundNames[roundKey as keyof typeof roundNames]}
      </h3>
      <div className="space-y-6">
        {matches.map((match, index) => renderMatch(match, index))}
      </div>
    </div>
  );

  if (!matches || matches.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Bracket Created</h3>
          <p className="text-gray-500 mb-4">
            This tournament doesn't have a bracket structure yet.
          </p>
          <Button 
            variant="outline" 
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={() => console.log('Generate bracket')}
          >
            Generate Bracket
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              {tournament.logo ? (
                <img 
                  src={tournament.logo} 
                  alt={`${tournament.name} logo`}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Trophy className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{tournament.name}</h2>
              <p className="text-blue-100">{tournament.description}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{tournament.totalTeams} Teams</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{tournament.matchFormat}</span>
            </div>
            {tournament.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{tournament.venue}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bracket Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Tournament Bracket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-8 min-w-fit">
              {roundOrder.map(roundKey => {
                const roundMatches = matchesByRound[roundKey];
                if (!roundMatches || roundMatches.length === 0) return null;
                return renderRound(roundKey, roundMatches);
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {matches.filter(m => m.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed Matches</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {matches.filter(m => m.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-600">Live Matches</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {matches.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Upcoming Matches</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}