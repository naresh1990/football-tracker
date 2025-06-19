import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, Upload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ClubFormProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  club?: any;
  mode?: 'add' | 'edit';
}

export default function ClubForm({ trigger, onSuccess, club, mode = 'add' }: ClubFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: club?.name || "",
    type: club?.type || "",
    level: club?.level || "",
    status: club?.status || "Active",
    seasonStart: club?.seasonStart ? new Date(club.seasonStart).toISOString().split('T')[0] : "",
    seasonEnd: club?.seasonEnd ? new Date(club.seasonEnd).toISOString().split('T')[0] : "",
    description: club?.description || "",
    logo: club?.logo || ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createClubMutation = useMutation({
    mutationFn: (data: any) => 
      mode === 'edit' && club 
        ? apiRequest("PUT", `/api/clubs/${club.id}`, data)
        : apiRequest("POST", "/api/clubs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      toast({
        title: "Success",
        description: `Club ${mode === 'edit' ? 'updated' : 'added'} successfully`,
      });
      setOpen(false);
      if (mode === 'add') {
        setFormData({
          name: "",
          type: "",
          level: "",
          status: "Active",
          seasonStart: "",
          seasonEnd: "",
          description: "",
          logo: ""
        });
      }
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${mode === 'edit' ? 'update' : 'add'} club`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClubMutation.mutate({
      ...formData,
      playerId: 1,
      seasonStart: formData.seasonStart ? new Date(formData.seasonStart).toISOString() : null,
      seasonEnd: formData.seasonEnd ? new Date(formData.seasonEnd).toISOString() : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 w-auto inline-flex items-center whitespace-nowrap !text-white">
            <Plus className="mr-2 h-4 w-4" />
            {mode === 'edit' ? 'Edit Club' : 'Add Club'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Club' : 'Add New Club'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Update your club information and details'
              : 'Add a new club to track your football journey'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Club Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sporthood FC"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Club Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select club type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academy">Academy</SelectItem>
                  <SelectItem value="School Team">School Team</SelectItem>
                  <SelectItem value="Local Club">Local Club</SelectItem>
                  <SelectItem value="Professional Club">Professional Club</SelectItem>
                  <SelectItem value="Training Center">Training Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Squad Level (Optional)</Label>
              <Input
                id="level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                placeholder="e.g., U10 Elite Squad"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Former">Former</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seasonStart">Season Start (Optional)</Label>
              <Input
                id="seasonStart"
                type="date"
                value={formData.seasonStart}
                onChange={(e) => setFormData({ ...formData, seasonStart: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="seasonEnd">Season End (Optional)</Label>
              <Input
                id="seasonEnd"
                type="date"
                value={formData.seasonEnd}
                onChange={(e) => setFormData({ ...formData, seasonEnd: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Club description, training philosophy, achievements..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="logo">Club Logo URL (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
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
              disabled={createClubMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {createClubMutation.isPending 
                ? (mode === 'edit' ? 'Updating...' : 'Adding...') 
                : (mode === 'edit' ? 'Update Club' : 'Add Club')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}