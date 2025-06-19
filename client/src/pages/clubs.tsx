import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Building, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Clubs() {
  const { toast } = useToast();

  const { data: clubs, isLoading } = useQuery({
    queryKey: ["/api/clubs", { playerId: 1 }],
  });

  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches", { playerId: 1 }],
  });

  const deleteClubMutation = useMutation({
    mutationFn: (clubId: number) => apiRequest("DELETE", `/api/clubs/${clubId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      toast({
        title: "Success",
        description: "Club deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete club",
        variant: "destructive",
      });
    },
  });

  const getClubCoaches = (clubId: number) => {
    return coaches?.filter((coach: any) => coach.clubId === clubId) || [];
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "text-green-600" : "text-gray-500";
  };

  const getTypeIcon = (type: string) => {
    return type === "primary" ? "🏆" : "⚽";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clubs</h1>
        <Button className="bg-football-green hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Club
        </Button>
      </div>

      <div className="grid gap-6">
        {clubs && clubs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first club association.</p>
            </CardContent>
          </Card>
        ) : (
          clubs?.map((club: any) => {
            const clubCoaches = getClubCoaches(club.id);
            return (
              <Card key={club.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getTypeIcon(club.type)}</div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          {club.name}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className={`font-medium ${getStatusColor(club.status)}`}>
                            {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
                          </span>
                          <span className="capitalize">
                            {club.type} Club
                          </span>
                          {club.squadLevel && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {club.squadLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteClubMutation.mutate(club.id)}
                        disabled={deleteClubMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Club Details */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Club Details</h4>
                      {club.seasonStart && club.seasonEnd && (
                        <div className="text-sm text-gray-600">
                          <strong>Season:</strong> {formatDate(club.seasonStart)} - {formatDate(club.seasonEnd)}
                        </div>
                      )}
                      {club.description && (
                        <div className="text-sm text-gray-600">
                          <strong>Description:</strong> {club.description}
                        </div>
                      )}
                    </div>

                    {/* Associated Coaches */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <h4 className="font-medium text-gray-900">
                          Coaches ({clubCoaches.length})
                        </h4>
                      </div>
                      {clubCoaches.length > 0 ? (
                        <div className="space-y-2">
                          {clubCoaches.map((coach: any) => (
                            <div key={coach.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-900">{coach.name}</span>
                              <span className="text-gray-500">{coach.title}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No coaches assigned</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}