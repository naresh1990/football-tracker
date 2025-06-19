import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertCoachFeedbackSchema } from "@shared/schema";
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
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

// Coach dropdown component
function CoachDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches/active", { playerId: 1 }],
  });

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select coach" />
      </SelectTrigger>
      <SelectContent>
        {coaches?.map((coach: any) => (
          <SelectItem key={coach.id} value={coach.name}>
            {coach.name} ({coach.title})
          </SelectItem>
        ))}
        <SelectItem value="other">Other Coach</SelectItem>
      </SelectContent>
    </Select>
  );
}

const feedbackFormSchema = insertCoachFeedbackSchema.extend({
  date: z.string().min(1, "Date is required"),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

interface FeedbackFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FeedbackForm({ onSuccess, onCancel }: FeedbackFormProps) {
  const { toast } = useToast();
  const [newStrength, setNewStrength] = useState("");
  const [newImprovement, setNewImprovement] = useState("");
  
  // Get recent games for selection
  const { data: games } = useQuery({
    queryKey: ["/api/games/recent", { playerId: 1, limit: 10 }],
  });
  
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      playerId: 1, // Darshil's ID
      gameId: null,
      coach: "",
      date: "",
      comment: "",
      strengths: [],
      improvements: [],
      rating: "",
    },
  });



  const createFeedbackMutation = useMutation({
    mutationFn: (data: FeedbackFormData) => {
      const feedbackData = {
        ...data,
        date: new Date(data.date),
        rating: data.rating || null,
        gameId: data.gameId || null,
      };
      return apiRequest("POST", "/api/feedback", feedbackData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({
        title: "Success",
        description: "Feedback added successfully",
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add feedback",
        variant: "destructive",
      });
    },
  });

  const addStrength = () => {
    if (newStrength.trim()) {
      const currentStrengths = form.getValues("strengths") || [];
      form.setValue("strengths", [...currentStrengths, newStrength.trim()]);
      setNewStrength("");
    }
  };

  const removeStrength = (index: number) => {
    const currentStrengths = form.getValues("strengths") || [];
    form.setValue("strengths", currentStrengths.filter((_, i) => i !== index));
  };

  const addImprovement = () => {
    if (newImprovement.trim()) {
      const currentImprovements = form.getValues("improvements") || [];
      form.setValue("improvements", [...currentImprovements, newImprovement.trim()]);
      setNewImprovement("");
    }
  };

  const removeImprovement = (index: number) => {
    const currentImprovements = form.getValues("improvements") || [];
    form.setValue("improvements", currentImprovements.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FeedbackFormData) => {
    createFeedbackMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-football-green">Add Coach Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coach"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coach</FormLabel>
                    <FormControl>
                      <CoachDropdown value={field.value} onChange={field.onChange} />
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
                    <FormLabel>Feedback Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gameId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Game (Optional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a game" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No specific game</SelectItem>
                        {games?.map((game: any) => (
                          <SelectItem key={game.id} value={game.id.toString()}>
                            vs {game.opponent} - {new Date(game.date).toLocaleDateString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Rating (1-10)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10" 
                        step="0.1"
                        placeholder="Optional"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Comment</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed feedback about performance, skills, and areas to focus on..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Strengths Section */}
            <div className="space-y-3">
              <FormLabel>Strengths</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add strength (e.g., Passing, Speed)"
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStrength())}
                />
                <Button type="button" onClick={addStrength} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("strengths")?.map((strength, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800">
                    {strength}
                    <button
                      type="button"
                      onClick={() => removeStrength(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Improvements Section */}
            <div className="space-y-3">
              <FormLabel>Areas for Improvement</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add improvement area (e.g., First Touch, Positioning)"
                  value={newImprovement}
                  onChange={(e) => setNewImprovement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImprovement())}
                />
                <Button type="button" onClick={addImprovement} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("improvements")?.map((improvement, index) => (
                  <Badge key={index} className="bg-yellow-100 text-yellow-800">
                    {improvement}
                    <button
                      type="button"
                      onClick={() => removeImprovement(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                className="bg-football-green hover:bg-green-700"
                disabled={createFeedbackMutation.isPending}
              >
                {createFeedbackMutation.isPending ? "Adding..." : "Add Feedback"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
