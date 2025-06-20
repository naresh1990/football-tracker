import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TournamentPointsFormProps {
  tournament: any;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function TournamentPointsForm({ tournament, trigger, onSuccess }: TournamentPointsFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPosition: tournament?.currentPosition?.toString() || "",
    points: tournament?.points?.toString() || "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/tournaments/${tournament.id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: "Tournament position and points updated successfully",
      });
      setOpen(false);
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tournament",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      currentPosition: parseInt(formData.currentPosition) || null,
      points: parseInt(formData.points) || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Update Position & Points
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Update Tournament Standing
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPosition">Current Position</Label>
            <Input
              id="currentPosition"
              type="number"
              min="1"
              value={formData.currentPosition}
              onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
              placeholder="e.g., 1, 2, 3..."
            />
          </div>

          <div>
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              min="0"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              placeholder="e.g., 15, 20, 25..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600"
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}