import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
    notes: "",
    completed: false,
    isRecurring: false,
    recurringDays: [] as string[],
    endDate: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch coaches for dropdown
  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches"],
  });

  const createTrainingMutation = useMutation({
    mutationFn: (data: any) => {
      if (data.isRecurring) {
        return apiRequest("POST", "/api/training/recurring", data);
      } else {
        return apiRequest("POST", "/api/training", data);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      queryClient.invalidateQueries({ queryKey: ["/api/training/upcoming"] });
      const sessionsCount = variables.isRecurring ? "sessions" : "session";
      toast({
        title: "Success",
        description: `Training ${sessionsCount} added successfully`,
      });
      setOpen(false);
      setFormData({
        type: "",
        date: "",
        time: "",
        duration: "",
        location: "",
        coach: "",
        notes: "",
        completed: false,
        isRecurring: false,
        recurringDays: [],
        endDate: ""
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
    
    if (formData.isRecurring) {
      // For recurring sessions, send all the recurring data
      createTrainingMutation.mutate({
        playerId: 1,
        type: formData.type,
        startDate: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration) || 60,
        location: formData.location,
        coach: formData.coach,
        notes: formData.notes,
        isRecurring: true,
        recurringDays: formData.recurringDays,
        endDate: formData.endDate,
      });
    } else {
      // Convert date and time to proper datetime for single session
      const sessionDate = new Date(`${formData.date}T${formData.time}`);
      
      createTrainingMutation.mutate({
        playerId: 1,
        type: formData.type,
        date: sessionDate.toISOString(),
        duration: parseInt(formData.duration) || 60,
        location: formData.location,
        coach: formData.coach,
        notes: formData.notes,
        completed: formData.completed,
      });
    }
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white z-[9998]">
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
              <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                <SelectItem value="Speed & Agility" className="text-gray-900 hover:bg-green-50 hover:text-green-900 cursor-pointer">Speed & Agility</SelectItem>
                <SelectItem value="Ball Control" className="text-gray-900 hover:bg-green-50 hover:text-green-900 cursor-pointer">Ball Control</SelectItem>
                <SelectItem value="Team Practice" className="text-gray-900 hover:bg-green-50 hover:text-green-900 cursor-pointer">Team Practice</SelectItem>
                <SelectItem value="Fitness Training" className="text-gray-900 hover:bg-green-50 hover:text-green-900 cursor-pointer">Fitness Training</SelectItem>
                <SelectItem value="Shooting Practice" className="text-gray-900 hover:bg-green-50 hover:text-green-900 cursor-pointer">Shooting Practice</SelectItem>
                <SelectItem value="Tactical Training" className="text-gray-900 hover:bg-green-50 hover:text-green-900 cursor-pointer">Tactical Training</SelectItem>
                <SelectItem value="Conditioning" className="text-gray-900 hover:bg-green-50 hover:text-green-900 cursor-pointer">Conditioning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: !!checked })}
              />
              <Label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Create recurring sessions
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">{formData.isRecurring ? "Start Date" : "Date"}</Label>
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

            {formData.isRecurring && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border">
                <div>
                  <Label>Select Days of Week</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={formData.recurringDays.includes(day)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, recurringDays: [...formData.recurringDays, day] });
                            } else {
                              setFormData({ ...formData, recurringDays: formData.recurringDays.filter(d => d !== day) });
                            }
                          }}
                        />
                        <Label htmlFor={day} className="text-xs">{day.slice(0, 3)}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required={formData.isRecurring}
                    min={formData.date}
                  />
                </div>
              </div>
            )}
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
              <Label htmlFor="completed">Session Status</Label>
              <Select value={formData.completed.toString()} onValueChange={(value) => setFormData({ ...formData, completed: value === 'true' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                  <SelectItem value="false">Scheduled</SelectItem>
                  <SelectItem value="true">Completed</SelectItem>
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
            <Select value={formData.coach} onValueChange={(value) => setFormData({ ...formData, coach: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select coach" />
              </SelectTrigger>
              <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                {coaches && coaches.length > 0 ? (
                  coaches.map((coach: any) => (
                    <SelectItem key={coach.id} value={coach.name} className="text-gray-900 hover:bg-green-50 hover:text-green-900 cursor-pointer">
                      {coach.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="No coaches available" disabled className="text-gray-500">
                    No coaches available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
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
              disabled={createTrainingMutation.isPending || (formData.isRecurring && formData.recurringDays.length === 0)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {createTrainingMutation.isPending ? "Adding..." : formData.isRecurring ? "Create Training Sessions" : "Add Training Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}