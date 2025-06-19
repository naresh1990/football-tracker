import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertTrainingSessionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trainingFormSchema = insertTrainingSessionSchema.extend({
  date: z.string().min(1, "Date is required"),
});

type TrainingFormData = z.infer<typeof trainingFormSchema>;

interface TrainingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TrainingForm({ onSuccess, onCancel }: TrainingFormProps) {
  const { toast } = useToast();
  
  const form = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      playerId: 1, // Darshil's ID
      type: "",
      date: "",
      duration: 60,
      location: "",
      coach: "",
      notes: "",
      completed: false,
    },
  });

  const createTrainingMutation = useMutation({
    mutationFn: (data: TrainingFormData) => {
      const trainingData = {
        ...data,
        date: new Date(data.date),
      };
      return apiRequest("POST", "/api/training", trainingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      toast({
        title: "Success",
        description: "Training session added successfully",
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add training session",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TrainingFormData) => {
    createTrainingMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-football-green">Add Training Session</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select training type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Speed & Agility">Speed & Agility</SelectItem>
                        <SelectItem value="Ball Control">Ball Control</SelectItem>
                        <SelectItem value="Team Practice">Team Practice</SelectItem>
                        <SelectItem value="Shooting Practice">Shooting Practice</SelectItem>
                        <SelectItem value="Passing & Crossing">Passing & Crossing</SelectItem>
                        <SelectItem value="Defensive Training">Defensive Training</SelectItem>
                        <SelectItem value="Fitness Training">Fitness Training</SelectItem>
                        <SelectItem value="Tactical Training">Tactical Training</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="15" 
                        max="240"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Main Field, Gym" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coach"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coach</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Coach Martinez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Training objectives, exercises, or any special notes..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as completed</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check this if the training session has already been completed
                    </p>
                  </div>
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
                disabled={createTrainingMutation.isPending}
              >
                {createTrainingMutation.isPending ? "Adding..." : "Add Training"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
