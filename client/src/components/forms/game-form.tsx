import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertGameSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const gameFormSchema = insertGameSchema.extend({
  date: z.string().min(1, "Date is required"),
  gameType: z.enum(["practice", "friendly", "tournament"]).default("practice"),
  matchFormat: z.enum(["2v2", "4v4", "5v5", "7v7"]).default("7v7"),
  tournamentId: z.number().optional(),
  homeAway: z.enum(["home", "away"]).default("home"),
  mistakes: z.number().min(0).optional(),
  coachFeedback: z.string().optional(),
});

type GameFormData = z.infer<typeof gameFormSchema>;

interface GameFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function GameForm({ onSuccess, onCancel }: GameFormProps) {
  const { toast } = useToast();
  
  // Get tournaments for linking tournament games
  const { data: tournaments } = useQuery({
    queryKey: ["/api/tournaments", { playerId: 1 }],
  });
  
  const form = useForm<GameFormData>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      playerId: 1, // Darshil's ID
      gameType: "practice",
      matchFormat: "7v7",
      tournamentId: undefined,
      opponent: "",
      date: "",
      homeAway: "home",
      teamScore: 0,
      opponentScore: 0,
      playerGoals: 0,
      playerAssists: 0,
      positionPlayed: "",
      minutesPlayed: 90,
      mistakes: 0,
      rating: "",
      coachFeedback: "",
      notes: "",
    },
  });

  const createGameMutation = useMutation({
    mutationFn: (data: GameFormData) => {
      const gameData = {
        ...data,
        date: new Date(data.date),
        rating: data.rating ? data.rating : null,
      };
      return apiRequest("POST", "/api/games", gameData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/summary"] });
      toast({
        title: "Success",
        description: "Game added successfully",
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add game",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GameFormData) => {
    const gameData = {
      ...data,
      date: new Date(data.date),
      tournamentId: data.gameType === "tournament" ? data.tournamentId : undefined,
    };
    createGameMutation.mutate(gameData);
  };
  
  const gameType = form.watch("gameType");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-football-green">Add Game</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="opponent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opponent Team</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Eagles FC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homeAway"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home/Away</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select venue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="away">Away</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gameType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select game type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="practice">Practice Game</SelectItem>
                        <SelectItem value="friendly">Friendly Match</SelectItem>
                        <SelectItem value="tournament">Tournament Match</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="matchFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Format</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select match format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2v2">2v2</SelectItem>
                        <SelectItem value="4v4">4v4</SelectItem>
                        <SelectItem value="5v5">5v5</SelectItem>
                        <SelectItem value="7v7">7v7</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {gameType === "tournament" && (
              <FormField
                control={form.control}
                name="tournamentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tournament" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tournaments?.map((tournament: any) => (
                          <SelectItem key={tournament.id} value={tournament.id.toString()}>
                            {tournament.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="positionPlayed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Played</FormLabel>
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
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="teamScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Score</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="opponentScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opponent Score</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playerGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Goals</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playerAssists"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Assists</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minutesPlayed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes Played</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="120"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mistakes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mistakes Made</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value || 0}
                        min="0"
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coach Rating</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 8/10, Excellent, Good" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coachFeedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coach Feedback</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Post-match feedback from coach..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="General match observations..." rows={3} />
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
                disabled={createGameMutation.isPending}
              >
                {createGameMutation.isPending ? "Adding..." : "Add Game"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
