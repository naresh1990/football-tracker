import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, Trophy } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GameFormProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  tournament?: any; // For linking games to tournaments
}

export default function GameForm({ trigger, onSuccess, tournament }: GameFormProps) {
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

  const createGameMutation = useMutation({
    mutationFn: (data: any) => {
      console.log("Mutation function called with data:", data);
      return apiRequest("POST", "/api/games", data);
    },
    onSuccess: (response) => {
      console.log("Game created successfully:", response);
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games/recent"] });
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
        tournamentStage: "",
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
    onError: (error) => {
      console.error("Game creation failed:", error);
      toast({
        title: "Error",
        description: "Failed to add game",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gameData = {
      ...formData,
      playerId: 1,
      gameType: tournament ? "tournament" : "friendly",
      matchFormat: tournament?.matchFormat || "11v11",
      tournamentId: tournament?.id || null,
      tournamentStage: tournament && formData.tournamentStage ? formData.tournamentStage : null,
      homeAway: "away",
      venue: formData.venue || null,
      teamScore: parseInt(formData.teamScore),
      opponentScore: parseInt(formData.opponentScore),
      playerGoals: parseInt(formData.playerGoals) || 0,
      playerAssists: parseInt(formData.playerAssists) || 0,
      minutesPlayed: parseInt(formData.minutesPlayed) || 0,
      pointsEarned: parseInt(formData.pointsEarned) || 0,
      date: formData.date, // Send as string, let server transform it
    };
    
    console.log("Submitting game data:", gameData);
    createGameMutation.mutate(gameData);
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
          <DialogTitle>{tournament ? `Add Game to ${tournament.name}` : 'Add New Game'}</DialogTitle>
          <DialogDescription>
            {tournament 
              ? `Record a game from the ${tournament.name} tournament`
              : 'Record your match performance and track your football progress'
            }
          </DialogDescription>
        </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
          {tournament && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-blue-800 font-medium">
                <Trophy className="w-4 h-4" />
                Tournament: {tournament.name}
              </div>
              <div className="text-sm text-blue-600 mt-1">
                Match Format: {tournament.matchFormat} • Venue: {tournament.venue}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opponent">Opponent</Label>
              <Input
                id="opponent"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                placeholder="Team/Player name"
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
                value={formData.venue || tournament?.venue || ""}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder={tournament?.venue || "Playing venue"}
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

          <div className="grid grid-cols-2 gap-4">
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