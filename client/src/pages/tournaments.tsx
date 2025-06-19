import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Eye, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Tournaments() {
  const playerId = 1;

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["/api/tournaments", { playerId }],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Tournament
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
        <Button className="bg-football-green hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Tournament
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No tournaments found</p>
          </div>
        ) : (
          tournaments?.map((tournament: any) => (
            <Card key={tournament.id} className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  <Badge className={getStatusColor(tournament.status)} variant="secondary">
                    {tournament.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{tournament.description}</p>
                
                <div className="space-y-3 mb-6">
                  {tournament.startDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{formatDate(tournament.startDate)}</span>
                    </div>
                  )}
                  {tournament.currentPosition && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">{tournament.currentPosition} Place</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Games:</span>
                    <span className="font-medium">
                      {tournament.gamesPlayed}/{tournament.totalGames || '?'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-medium">{tournament.points} pts</span>
                  </div>
                  {tournament.format && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">{tournament.format}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-football-green">
                    <Upload className="w-4 h-4 mr-1" />
                    Points Table
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
