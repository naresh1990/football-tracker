import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertCoachSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const coachFormSchema = insertCoachSchema.extend({
  clubId: z.number().optional(),
});

type CoachFormData = z.infer<typeof coachFormSchema>;

interface CoachFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CoachForm({ onSuccess, onCancel }: CoachFormProps) {
  const { toast } = useToast();
  
  // Get clubs for selection
  const { data: clubs } = useQuery({
    queryKey: ["/api/clubs", { playerId: 1 }],
  });
  
  const form = useForm<CoachFormData>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      playerId: 1,
      clubId: undefined,
      name: "",
      title: "Head Coach",
      contact: "",
      isActive: true,
    },
  });

  const createCoachMutation = useMutation({
    mutationFn: (data: CoachFormData) => {
      return apiRequest("POST", "/api/coaches", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coaches"] });
      toast({
        title: "Success",
        description: "Coach added successfully",
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add coach",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CoachFormData) => {
    createCoachMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-football-green">Add Coach</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coach Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Coach Martinez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coach Title</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coach title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Head Coach">Head Coach</SelectItem>
                        <SelectItem value="Assistant Coach">Assistant Coach</SelectItem>
                        <SelectItem value="Adhoc Coach">Adhoc Coach</SelectItem>
                        <SelectItem value="Fitness Coach">Fitness Coach</SelectItem>
                        <SelectItem value="Goalkeeping Coach">Goalkeeping Coach</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clubId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associated Club (Optional)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
                      value={field.value?.toString() || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select club" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No specific club</SelectItem>
                        {clubs?.map((club: any) => (
                          <SelectItem key={club.id} value={club.id.toString()}>
                            {club.name}
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
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Information</FormLabel>
                    <FormControl>
                      <Input placeholder="Email or phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Coach</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Coach is currently active and available for selection
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                disabled={createCoachMutation.isPending}
              >
                {createCoachMutation.isPending ? "Adding..." : "Add Coach"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}