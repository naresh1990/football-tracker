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

interface TrainingFormProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function TrainingForm({ trigger, onSuccess }: TrainingFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    coach: "",
    focus: "",
    intensity: "",
    notes: "",
    attended: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTrainingMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/training", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      queryClient.invalidateQueries({ queryKey: ["/api/training/upcoming"] });
      toast({
        title: "Success",
        description: "Training session added successfully",
      });
      setOpen(false);
      setFormData({
        type: "",
        date: "",
        time: "",
        duration: "",
        location: "",
        coach: "",
        focus: "",
        intensity: "",
        notes: "",
        attended: true
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sessionDate = new Date(`${formData.date}T${formData.time}`);
    
    createTrainingMutation.mutate({
      ...formData,
      playerId: 1,
      date: sessionDate.toISOString(),
      duration: parseInt(formData.duration) || 60,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="default"
            className="bg-green-600 hover:bg-green-700 font-bold px-4 py-2 w-auto inline-flex items-center whitespace-nowrap"
            style={{ color: 'white' }}
          >
            <Plus className="mr-2 h-4 w-4 text-white" />
            <span className="text-white">Add Training Session</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Add New Training Session</DialogTitle>
          <DialogDescription>
            Schedule and track your training sessions for skill development
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Training Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select training type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Speed & Agility">Speed & Agility</SelectItem>
                <SelectItem value="Ball Control">Ball Control</SelectItem>
                <SelectItem value="Team Practice">Team Practice</SelectItem>
                <SelectItem value="Fitness Training">Fitness Training</SelectItem>
                <SelectItem value="Shooting Practice">Shooting Practice</SelectItem>
                <SelectItem value="Tactical Training">Tactical Training</SelectItem>
                <SelectItem value="Conditioning">Conditioning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="180"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="60"
              />
            </div>
            <div>
              <Label htmlFor="intensity">Intensity</Label>
              <Select value={formData.intensity} onValueChange={(value) => setFormData({ ...formData, intensity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Very High">Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Training ground, gym, etc."
            />
          </div>

          <div>
            <Label htmlFor="coach">Coach/Trainer</Label>
            <Input
              id="coach"
              value={formData.coach}
              onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
              placeholder="Coach name"
            />
          </div>

          <div>
            <Label htmlFor="focus">Focus Areas</Label>
            <Input
              id="focus"
              value={formData.focus}
              onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
              placeholder="e.g., Passing, Shooting, Defending"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Training highlights, performance notes, areas worked on..."
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
              disabled={createTrainingMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {createTrainingMutation.isPending ? "Adding..." : "Add Training Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}