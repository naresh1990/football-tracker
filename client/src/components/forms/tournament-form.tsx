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

interface TournamentFormProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function TournamentForm({ trigger, onSuccess }: TournamentFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    format: "",
    ageGroup: "",
    status: "upcoming",
    currentPosition: "",
    totalGames: "",
    gamesPlayed: "",
    points: "",
    goalsScored: "",
    goalsConceded: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTournamentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/tournaments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: "Tournament added successfully",
      });
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        format: "",
        ageGroup: "",
        status: "upcoming",
        currentPosition: "",
        totalGames: "",
        gamesPlayed: "",
        points: "",
        goalsScored: "",
        goalsConceded: ""
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add tournament",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTournamentMutation.mutate({
      ...formData,
      playerId: 1,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      currentPosition: parseInt(formData.currentPosition) || null,
      totalGames: parseInt(formData.totalGames) || 0,
      gamesPlayed: parseInt(formData.gamesPlayed) || 0,
      points: parseInt(formData.points) || 0,
      goalsScored: parseInt(formData.goalsScored) || 0,
      goalsConceded: parseInt(formData.goalsConceded) || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="default"
            className="bg-yellow-500 hover:bg-yellow-600 font-bold px-4 py-2 w-auto inline-flex items-center whitespace-nowrap"
            style={{ color: 'white' }}
          >
            <Plus className="mr-2 h-4 w-4 text-white" />
            <span className="text-white">Add Tournament</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white z-[9998]">
        <DialogHeader>
          <DialogTitle>Add New Tournament</DialogTitle>
          <DialogDescription>
            Add a tournament to track your competitive performance and progress
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Tournament Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tournament details, format, rules..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="League">League</SelectItem>
                  <SelectItem value="Knockout">Knockout</SelectItem>
                  <SelectItem value="Round Robin">Round Robin</SelectItem>
                  <SelectItem value="Group Stage">Group Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ageGroup">Age Group</Label>
              <Input
                id="ageGroup"
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                placeholder="e.g., U10, U12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                <SelectItem value="upcoming" className="text-gray-900 hover:bg-yellow-50 hover:text-yellow-900 cursor-pointer">Upcoming</SelectItem>
                <SelectItem value="active" className="text-gray-900 hover:bg-yellow-50 hover:text-yellow-900 cursor-pointer">Active</SelectItem>
                <SelectItem value="completed" className="text-gray-900 hover:bg-yellow-50 hover:text-yellow-900 cursor-pointer">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currentPosition">Current Position</Label>
              <Input
                id="currentPosition"
                type="number"
                min="1"
                value={formData.currentPosition}
                onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="gamesPlayed">Games Played</Label>
              <Input
                id="gamesPlayed"
                type="number"
                min="0"
                value={formData.gamesPlayed}
                onChange={(e) => setFormData({ ...formData, gamesPlayed: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="totalGames">Total Games</Label>
              <Input
                id="totalGames"
                type="number"
                min="0"
                value={formData.totalGames}
                onChange={(e) => setFormData({ ...formData, totalGames: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="0"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="goalsScored">Goals Scored</Label>
              <Input
                id="goalsScored"
                type="number"
                min="0"
                value={formData.goalsScored}
                onChange={(e) => setFormData({ ...formData, goalsScored: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="goalsConceded">Goals Conceded</Label>
              <Input
                id="goalsConceded"
                type="number"
                min="0"
                value={formData.goalsConceded}
                onChange={(e) => setFormData({ ...formData, goalsConceded: e.target.value })}
              />
            </div>
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
              disabled={createTournamentMutation.isPending}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600"
            >
              {createTournamentMutation.isPending ? "Adding..." : "Add Tournament"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}