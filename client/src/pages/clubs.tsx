import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Building, Users, UserPlus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ClubForm from "@/components/forms/club-form";
import CoachForm from "@/components/forms/coach-form";
import { motion } from "framer-motion";

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

  const logoUploadMutation = useMutation({
    mutationFn: ({ clubId, file }: { clubId: number; file: File }) => {
      const formData = new FormData();
      formData.append("logo", file);
      return fetch(`/api/clubs/${clubId}/logo`, {
        method: "POST",
        body: formData,
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      toast({
        title: "Success",
        description: "Club logo updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    },
  });

  const handleLogoUpload = (clubId: number, file: File | undefined) => {
    if (file) {
      logoUploadMutation.mutate({ clubId, file });
    }
  };

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
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 w-full bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Clubs</h1>
          <ClubForm />
        </div>

        {(!clubs || clubs.length === 0) && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clubs added yet</h3>
            <p className="text-gray-600 mb-6">Add the football clubs you're part of to track your journey</p>
            <ClubForm trigger={
              <Button 
                className="bg-blue-600 hover:bg-blue-700 font-bold px-4 py-2 w-auto inline-flex items-center whitespace-nowrap"
                style={{ color: 'white' }}
              >
                <Plus className="mr-2 h-4 w-4 text-white" />
                <span className="text-white">Add Your First Club</span>
              </Button>
            } />
          </motion.div>
        )}

        <div className="grid gap-6">
        {clubs && clubs.length > 0 && (
          clubs?.map((club: any) => {
            const clubCoaches = getClubCoaches(club.id);
            return (
              <Card key={club.id} className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-blue-50 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <label htmlFor={`logo-upload-${club.id}`} className="relative group cursor-pointer">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                          {club.logo ? (
                            <img 
                              src={club.logo} 
                              alt={`${club.name} logo`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-2xl text-white">{getTypeIcon(club.type)}</div>
                          )}
                        </div>
                        {/* Hover overlay with pencil icon */}
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Edit className="w-5 h-5 text-white" />
                        </div>
                      </label>
                      <input
                        id={`logo-upload-${club.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(club.id, e.target.files?.[0])}
                      />
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                          {club.name}
                        </CardTitle>
                        <div className="flex items-center space-x-3 text-sm">
                          <span className={`font-semibold px-3 py-1 rounded-full text-xs ${getStatusColor(club.status)} bg-green-100 text-green-700`}>
                            {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
                          </span>
                          <span className="capitalize font-medium text-gray-600">
                            {club.type} Club
                          </span>
                          {club.squadLevel && (
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                              {club.squadLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ClubForm 
                        club={club}
                        mode="edit"
                        trigger={
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 w-auto inline-flex items-center"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteClubMutation.mutate(club.id)}
                        disabled={deleteClubMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Club Details */}
                    <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-500" />
                        Club Details
                      </h4>
                      <div className="space-y-3">
                        {club.seasonStart && club.seasonEnd && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 font-medium">Season:</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatDate(club.seasonStart)} - {formatDate(club.seasonEnd)}
                            </span>
                          </div>
                        )}
                        {club.description && (
                          <div>
                            <span className="text-sm text-gray-600 font-medium">Description:</span>
                            <p className="text-sm text-gray-900 mt-1">{club.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Associated Coaches */}
                    <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          Coaches
                        </h4>
                        <div className="bg-blue-100 px-3 py-1 rounded-full">
                          <span className="text-sm font-medium text-blue-700">
                            {clubCoaches.length} Members
                          </span>
                        </div>
                      </div>
                      {clubCoaches.length > 0 ? (
                        <div className="space-y-3">
                          {clubCoaches.map((coach: any) => (
                            <div key={coach.id} className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-blue-50">
                              <Avatar className="w-10 h-10 ring-2 ring-blue-200">
                                <AvatarImage src={coach.profilePicture} alt={coach.name} />
                                <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                  {coach.name.split(' ').map((n: string) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">{coach.name}</p>
                                <p className="text-xs text-blue-600 font-medium">{coach.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No coaches assigned</p>
                        </div>
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
    </div>
  );
}