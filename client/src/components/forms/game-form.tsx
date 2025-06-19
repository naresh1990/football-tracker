import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GameFormProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function GameForm({ trigger, onSuccess }: GameFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    opponent: "",
    date: "",
    venue: "",
    teamScore: "",
    opponentScore: "",
    playerGoals: "",
    playerAssists: "",
    positionPlayed: "",
    minutesPlayed: "",
    rating: "",
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createGameMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/games", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/summary"] });
      toast({
        title: "Success",
        description: "Game added successfully",
      });
      setOpen(false);
      setFormData({
        opponent: "",
        date: "",
        venue: "",
        teamScore: "",
        opponentScore: "",
        playerGoals: "",
        playerAssists: "",
        positionPlayed: "",
        minutesPlayed: "",
        rating: "",
        notes: ""
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGameMutation.mutate({
      ...formData,
      playerId: 1,
      teamScore: parseInt(formData.teamScore),
      opponentScore: parseInt(formData.opponentScore),
      playerGoals: parseInt(formData.playerGoals) || 0,
      playerAssists: parseInt(formData.playerAssists) || 0,
      minutesPlayed: parseInt(formData.minutesPlayed) || 0,
      date: new Date(formData.date).toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 font-bold px-4 py-2 w-auto inline-flex items-center whitespace-nowrap"
            style={{ color: 'white' }}
          >
            <Plus className="mr-2 h-4 w-4 text-white" />
            <span className="text-white">Add Game</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white z-[9998]">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
          <DialogDescription>
            Record your match performance and track your football progress
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opponent">Opponent</Label>
              <Input
                id="opponent"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamScore">Team Score</Label>
              <Input
                id="teamScore"
                type="number"
                min="0"
                value={formData.teamScore}
                onChange={(e) => setFormData({ ...formData, teamScore: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="opponentScore">Opponent Score</Label>
              <Input
                id="opponentScore"
                type="number"
                min="0"
                value={formData.opponentScore}
                onChange={(e) => setFormData({ ...formData, opponentScore: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="playerGoals">Your Goals</Label>
              <Input
                id="playerGoals"
                type="number"
                min="0"
                value={formData.playerGoals}
                onChange={(e) => setFormData({ ...formData, playerGoals: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="playerAssists">Your Assists</Label>
              <Input
                id="playerAssists"
                type="number"
                min="0"
                value={formData.playerAssists}
                onChange={(e) => setFormData({ ...formData, playerAssists: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="positionPlayed">Position Played</Label>
              <Select value={formData.positionPlayed} onValueChange={(value) => setFormData({ ...formData, positionPlayed: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                  <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                  <SelectItem value="Defender">Defender</SelectItem>
                  <SelectItem value="Midfielder">Midfielder</SelectItem>
                  <SelectItem value="Forward">Forward</SelectItem>
                  <SelectItem value="Winger">Winger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="minutesPlayed">Minutes Played</Label>
              <Input
                id="minutesPlayed"
                type="number"
                min="0"
                max="120"
                value={formData.minutesPlayed}
                onChange={(e) => setFormData({ ...formData, minutesPlayed: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rating">Performance Rating (1-10)</Label>
            <Input
              id="rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="e.g., 8.5/10"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Match highlights, observations, areas for improvement..."
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
              disabled={createGameMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {createGameMutation.isPending ? "Adding..." : "Add Game"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}