import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertPlayerSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useState } from "react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

const playerFormSchema = insertPlayerSchema.extend({
  dateOfBirth: z.string().optional(),
});

type PlayerFormData = z.infer<typeof playerFormSchema>;

interface PlayerProfileFormProps {
  playerId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PlayerProfileForm({ playerId, onSuccess, onCancel }: PlayerProfileFormProps) {
  const { toast } = useToast();
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  
  // Get current player data
  const { data: player, isLoading } = useQuery({
    queryKey: ["/api/players", playerId],
  });
  
  const form = useForm<PlayerFormData>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      name: "",
      age: 12,
      position: "Midfielder",
      team: "",
      jerseyNumber: "",
      dateOfBirth: "",
      height: "",
      weight: "",
      preferredFoot: "right",
      nationality: "",
      coachNotes: "",
    },
  });

  // Update form when player data loads
  React.useEffect(() => {
    if (player) {
      form.reset({
        name: player.name || "",
        age: player.age || 12,
        position: player.position || "Midfielder",
        team: player.team || "",
        jerseyNumber: player.jerseyNumber || "",
        dateOfBirth: player.dateOfBirth ? new Date(player.dateOfBirth).toISOString().split('T')[0] : "",
        height: player.height || "",
        weight: player.weight || "",
        preferredFoot: player.preferredFoot || "right",
        nationality: player.nationality || "",
        coachNotes: player.coachNotes || "",
      });
      if (player.profilePicture) {
        setProfilePreview(player.profilePicture);
      }
    }
  }, [player, form]);

  const updatePlayerMutation = useMutation({
    mutationFn: (data: PlayerFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (key === 'dateOfBirth') {
            formData.append(key, value ? new Date(value).toISOString() : '');
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      if (profileFile) {
        formData.append('profilePicture', profileFile);
      }
      
      return fetch(`/api/players/${playerId}`, {
        method: 'PUT',
        body: formData,
      }).then(res => {
        if (!res.ok) throw new Error('Failed to update player');
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfile = () => {
    setProfileFile(null);
    setProfilePreview(player?.profilePicture || null);
  };

  const onSubmit = (data: PlayerFormData) => {
    updatePlayerMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-football-green">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="space-y-3">
              <FormLabel>Profile Picture</FormLabel>
              <div className="flex items-center space-x-4">
                {profilePreview ? (
                  <div className="relative">
                    <img 
                      src={profilePreview} 
                      alt="Profile preview" 
                      className="w-20 h-20 object-cover rounded-full border"
                    />
                    <button
                      type="button"
                      onClick={removeProfile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload profile picture (PNG, JPG, max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Player name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="5" 
                        max="25"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                        <SelectItem value="Defender">Defender</SelectItem>
                        <SelectItem value="Midfielder">Midfielder</SelectItem>
                        <SelectItem value="Forward">Forward</SelectItem>
                        <SelectItem value="Winger">Winger</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team</FormLabel>
                    <FormControl>
                      <Input placeholder="Current team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jerseyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jersey Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredFoot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Foot</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred foot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Indian" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="coachNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coach Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Notes about playing style, strengths, areas for improvement..." rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                className="bg-football-green hover:bg-green-700"
                disabled={updatePlayerMutation.isPending}
              >
                {updatePlayerMutation.isPending ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}