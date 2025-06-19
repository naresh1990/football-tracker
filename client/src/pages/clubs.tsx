import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Building, Users, UserPlus, ChevronDown, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ClubForm from "@/components/forms/club-form";
import CoachForm from "@/components/forms/coach-form";
import SquadMemberForm from "@/components/forms/squad-member-form";
import { motion } from "framer-motion";

export default function Clubs() {
  const { toast } = useToast();
  const [expandedClubs, setExpandedClubs] = useState<Set<number>>(new Set());

  const { data: clubs, isLoading } = useQuery({
    queryKey: ["/api/clubs", { playerId: 1 }],
  });

  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches", { playerId: 1 }],
  });

  const { data: squadMembers } = useQuery({
    queryKey: ["/api/squad"],
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
  });

  const deleteCoachMutation = useMutation({
    mutationFn: (coachId: number) => apiRequest("DELETE", `/api/coaches/${coachId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coaches"] });
      toast({
        title: "Success",
        description: "Coach deleted successfully",
      });
    },
  });

  const deleteSquadMemberMutation = useMutation({
    mutationFn: (squadId: number) => apiRequest("DELETE", `/api/squad/${squadId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/squad"] });
      toast({
        title: "Success",
        description: "Squad member deleted successfully",
      });
    },
  });

  const handleDeleteClub = (clubId: number) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      deleteClubMutation.mutate(clubId);
    }
  };

  const handleDeleteCoach = (coachId: number) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      deleteCoachMutation.mutate(coachId);
    }
  };

  const handleDeleteSquadMember = (squadId: number) => {
    if (window.confirm("Are you sure you want to delete this squad member?")) {
      deleteSquadMemberMutation.mutate(squadId);
    }
  };

  const getClubCoaches = (clubId: number) => {
    return coaches?.filter((coach: any) => coach.clubId === clubId) || [];
  };

  const getClubSquadMembers = (clubId: number) => {
    return squadMembers?.filter((member: any) => member.clubId === clubId) || [];
  };

  const toggleClubExpansion = (clubId: number) => {
    const newExpanded = new Set(expandedClubs);
    if (newExpanded.has(clubId)) {
      newExpanded.delete(clubId);
    } else {
      newExpanded.add(clubId);
    }
    setExpandedClubs(newExpanded);
  };

  const isClubExpanded = (clubId: number) => expandedClubs.has(clubId);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Football Clubs
            </h1>
            <p className="text-gray-600 mt-2">Manage your football club memberships and teams</p>
          </div>
          <ClubForm trigger={
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg">
              <Plus className="mr-2 h-5 w-5" />
              Add New Club
            </Button>
          } />
        </div>

        {(!clubs || clubs.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clubs added yet</h3>
            <p className="text-gray-600 mb-6">Add the football clubs you're part of to track your journey</p>
            <ClubForm trigger={
              <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-4 py-2 w-auto inline-flex items-center whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4 text-white" />
                <span className="text-white">Add Your First Club</span>
              </Button>
            } />
          </motion.div>
        )}

        <div className="grid gap-6">
          {clubs && clubs.length > 0 && clubs.map((club: any) => {
            const clubCoaches = getClubCoaches(club.id);
            const squadMembersData = getClubSquadMembers(club.id);
            const isExpanded = isClubExpanded(club.id);
            
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
                  <CardHeader 
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white relative cursor-pointer hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                    onClick={() => toggleClubExpansion(club.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {club.logo ? (
                          <img
                            src={club.logo}
                            alt={`${club.name} logo`}
                            className="w-12 h-12 rounded-lg object-cover border-2 border-white/20"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-xl font-bold flex items-center gap-2">
                            {club.name}
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={club.status === "active" ? "default" : "secondary"} className="text-xs">
                              {club.status === "active" ? "🌟 Active" : "Former"}
                            </Badge>
                            <Badge variant="outline" className="text-white border-white/30 text-xs">
                              {club.type}
                            </Badge>
                            {club.squadLevel && (
                              <Badge variant="outline" className="text-white border-white/30 text-xs">
                                {club.squadLevel}
                              </Badge>
                            )}
                          </div>
                          {!isExpanded && (
                            <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                              <span>{clubCoaches.length} Coaches</span>
                              <span>{squadMembersData.length} Players</span>
                              {club.seasonStart && club.seasonEnd && (
                                <span>
                                  {formatDate(club.seasonStart)} - {formatDate(club.seasonEnd)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <ClubForm
                          club={club}
                          onSuccess={() => {
                            queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
                            toast({
                              title: "Success",
                              description: "Club updated successfully",
                            });
                          }}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => handleDeleteClub(club.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Club Details */}
                        <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Building className="w-4 h-4 text-blue-500" />
                            Club Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {club.seasonStart && club.seasonEnd && (
                              <div>
                                <span className="text-sm text-gray-600 font-medium">Season:</span>
                                <p className="text-sm text-gray-900 mt-1">
                                  {formatDate(club.seasonStart)} - {formatDate(club.seasonEnd)}
                                </p>
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

                        {/* Coaches and Squad Members Tabs */}
                        <div className="bg-white/60 rounded-xl p-4 border border-gray-100">
                          <Tabs defaultValue="coaches" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="coaches" className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Coaches ({clubCoaches.length})
                              </TabsTrigger>
                              <TabsTrigger value="squad" className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Squad ({squadMembersData.length})
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="coaches" className="mt-4">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-gray-900">Coaching Staff</h4>
                                <CoachForm
                                  clubId={club.id}
                                  onSuccess={() => {
                                    queryClient.invalidateQueries({ queryKey: ["/api/coaches"] });
                                  }}
                                  trigger={
                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                      <UserPlus className="w-3 h-3 mr-1" />
                                      Add Coach
                                    </Button>
                                  }
                                />
                              </div>
                              
                              {clubCoaches.length > 0 ? (
                                <div className="space-y-3">
                                  {clubCoaches.map((coach: any) => (
                                    <div key={coach.id} className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-blue-50 hover:bg-white/90 transition-colors">
                                      <Avatar className="w-12 h-12 ring-2 ring-blue-200">
                                        <AvatarImage 
                                          src={coach.profilePicture} 
                                          alt={coach.name}
                                          className="object-cover"
                                        />
                                        <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                          {coach.name.split(' ').map((n: string) => n[0]).join('')}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm">{coach.name}</p>
                                        <p className="text-xs text-blue-600 font-medium">{coach.title}</p>
                                        {coach.contact && (
                                          <p className="text-xs text-gray-500 mt-1">{coach.contact}</p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {coach.isActive ? (
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Inactive
                                          </span>
                                        )}
                                        <div className="flex gap-1">
                                          <CoachForm
                                            coach={coach}
                                            onSuccess={() => {
                                              queryClient.invalidateQueries({ queryKey: ["/api/coaches"] });
                                            }}
                                            trigger={
                                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-blue-100">
                                                <Edit className="h-3 w-3 text-blue-600" />
                                              </Button>
                                            }
                                          />
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-red-100"
                                            onClick={() => handleDeleteCoach(coach.id)}
                                          >
                                            <Trash2 className="h-3 w-3 text-red-600" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6 text-gray-500">
                                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                  <p className="text-sm mb-3">No coaches assigned</p>
                                  <CoachForm 
                                    trigger={
                                      <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
                                        <UserPlus className="w-4 h-4 mr-1" />
                                        Add First Coach
                                      </Button>
                                    }
                                    clubId={club.id}
                                    onSuccess={() => {
                                      queryClient.invalidateQueries({ queryKey: ["/api/coaches"] });
                                    }}
                                  />
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="squad" className="mt-4">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-gray-900">Squad Members</h4>
                                <SquadMemberForm
                                  clubId={club.id}
                                  onSuccess={() => {
                                    queryClient.invalidateQueries({ queryKey: ["/api/squad"] });
                                  }}
                                  trigger={
                                    <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                                      <UserPlus className="w-3 h-3 mr-1" />
                                      Add Player
                                    </Button>
                                  }
                                />
                              </div>
                              
                              {squadMembersData.length > 0 ? (
                                <div className="space-y-3">
                                  {squadMembersData.map((member: any) => (
                                    <div key={member.id} className="bg-white rounded-lg p-4 border border-green-100 hover:border-green-200 transition-all duration-200 shadow-sm hover:shadow-md w-full">
                                      <div className="flex items-center gap-4 w-full">
                                        <div className="relative flex-shrink-0">
                                          <Avatar className="w-14 h-14 ring-2 ring-green-200">
                                            <AvatarImage 
                                              src={member.profilePicture} 
                                              alt={member.name}
                                              className="object-cover"
                                            />
                                            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-green-500 to-blue-500 text-white">
                                              {member.name.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                          </Avatar>
                                          {member.jerseyNumber && (
                                            <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                                              #{member.jerseyNumber}
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                                            {member.name}
                                          </h4>
                                          <div className="flex items-center gap-3 flex-wrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                              {member.position}
                                            </span>
                                            {member.age && (
                                              <span className="text-sm text-gray-600 font-medium">
                                                Age {member.age}
                                              </span>
                                            )}
                                            {member.notes && (
                                              <span className="text-xs text-gray-500 italic truncate max-w-xs">
                                                {member.notes}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        
                                        <div className="flex gap-2 flex-shrink-0">
                                          <SquadMemberForm
                                            squadMember={member}
                                            onSuccess={() => {
                                              queryClient.invalidateQueries({ queryKey: ["/api/squad"] });
                                            }}
                                            trigger={
                                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-green-100 rounded-lg">
                                                <Edit className="h-4 w-4 text-green-600" />
                                              </Button>
                                            }
                                          />
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0 hover:bg-red-100 rounded-lg"
                                            onClick={() => handleDeleteSquadMember(member.id)}
                                          >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                                    <Users className="w-8 h-8 text-green-400" />
                                  </div>
                                  <h3 className="text-sm font-medium text-gray-900 mb-2">No squad members yet</h3>
                                  <p className="text-sm text-gray-500 mb-4">Add your first squad member to get started</p>
                                  <SquadMemberForm
                                    clubId={club.id}
                                    onSuccess={() => {
                                      queryClient.invalidateQueries({ queryKey: ["/api/squad"] });
                                    }}
                                    trigger={
                                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add First Player
                                      </Button>
                                    }
                                  />
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}