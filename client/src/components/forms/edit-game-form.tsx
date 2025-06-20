import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EditGameFormProps {
  game: any;
  tournament?: any;
}

export default function EditGameForm({ game, tournament }: EditGameFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    opponent: "",
    date: "",
    venue: "",
    tournamentStage: "",
    teamScore: "",
    opponentScore: "",
    playerGoals: "",
    playerAssists: "",
    positionPlayed: "",
    minutesPlayed: "",
    rating: "",
    pointsEarned: "",
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (game) {
      setFormData({
        opponent: game.opponent || "",
        date: game.date ? new Date(game.date).toISOString().split('T')[0] : "",
        venue: game.venue || "",
        tournamentStage: game.tournamentStage || "",
        teamScore: game.teamScore?.toString() || "",
        opponentScore: game.opponentScore?.toString() || "",
        playerGoals: game.playerGoals?.toString() || "",
        playerAssists: game.playerAssists?.toString() || "",
        positionPlayed: game.positionPlayed || "",
        minutesPlayed: game.minutesPlayed?.toString() || "",
        rating: game.rating || "",
        pointsEarned: game.pointsEarned?.toString() || "",
        notes: game.notes || ""
      });
    }
  }, [game]);

  const updateGameMutation = useMutation({
    mutationFn: (data: any) => {
      console.log("Updating game with data:", data);
      return apiRequest("PUT", `/api/games/${game.id}`, data);
    },
    onSuccess: (response) => {
      console.log("Game updated successfully:", response);
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/summary"] });
      toast({
        title: "Success",
        description: "Game updated successfully",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Game update failed:", error);
      toast({
        title: "Error",
        description: "Failed to update game",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gameData = {
      ...formData,
      teamScore: parseInt(formData.teamScore),
      opponentScore: parseInt(formData.opponentScore),
      playerGoals: parseInt(formData.playerGoals) || 0,
      playerAssists: parseInt(formData.playerAssists) || 0,
      minutesPlayed: parseInt(formData.minutesPlayed) || 0,
      pointsEarned: parseInt(formData.pointsEarned) || 0,
      date: formData.date,
    };
    
    console.log("Submitting updated game data:", gameData);
    updateGameMutation.mutate(gameData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Game</DialogTitle>
          <DialogDescription>
            Update game details and performance statistics
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opponent">Opponent</Label>
              <Input
                id="opponent"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                placeholder="Opponent team name"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Playing venue"
              />
            </div>
            {tournament && (
              <div>
                <Label htmlFor="tournamentStage">Tournament Stage</Label>
                <Select value={formData.tournamentStage} onValueChange={(value) => setFormData({ ...formData, tournamentStage: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                    <SelectItem value="league">League Stage</SelectItem>
                    <SelectItem value="knockout">Knockout Round</SelectItem>
                    <SelectItem value="round-of-16">Round of 16</SelectItem>
                    <SelectItem value="quarter-final">Quarter Final</SelectItem>
                    <SelectItem value="semi-final">Semi Final</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
                  <SelectItem value="Winger">Winger</SelectItem>
                  <SelectItem value="Forward">Forward</SelectItem>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating (1-10)</Label>
              <Input
                id="rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                placeholder="Coach rating"
              />
            </div>
            <div>
              <Label htmlFor="pointsEarned">Points Earned</Label>
              <Input
                id="pointsEarned"
                type="number"
                min="0"
                value={formData.pointsEarned}
                onChange={(e) => setFormData({ ...formData, pointsEarned: e.target.value })}
                placeholder="3 for win, 1 for draw, 0 for loss"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Game notes, coach feedback, etc."
              rows={3}
            />
          </div>

          </form>
        </div>
        <div className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={updateGameMutation.isPending}
            onClick={handleSubmit}
          >
            {updateGameMutation.isPending ? "Updating..." : "Update Game"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}