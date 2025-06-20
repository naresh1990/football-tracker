import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, Upload, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TournamentFormProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  tournament?: any; // For editing existing tournament
  mode?: 'create' | 'edit';
}

export default function TournamentForm({ trigger, onSuccess, tournament, mode = 'create' }: TournamentFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: tournament?.name || "",
    description: tournament?.description || "",
    venue: tournament?.venue || "",
    startDate: tournament?.startDate ? new Date(tournament.startDate).toISOString().split('T')[0] : "",
    endDate: tournament?.endDate ? new Date(tournament.endDate).toISOString().split('T')[0] : "",
    format: tournament?.format || "",
    matchFormat: tournament?.matchFormat || "",
    status: tournament?.status || "upcoming",
    clubId: tournament?.clubId?.toString() || "",
    totalTeams: tournament?.totalTeams?.toString() || ""
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(tournament?.logo || "");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch clubs for dropdown
  const { data: clubs } = useQuery({
    queryKey: ["/api/clubs"],
  });

  const tournamentMutation = useMutation({
    mutationFn: async (data: any) => {
      // Upload logo if present
      let logoPath = tournament?.logo || "";
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append("logo", logoFile);
        
        const logoResponse = await fetch("/api/upload/tournament-logo", {
          method: "POST",
          body: logoFormData,
        });
        
        if (logoResponse.ok) {
          const result = await logoResponse.json();
          logoPath = result.filePath;
        }
      }
      
      const tournamentData = { ...data, logo: logoPath };
      
      return mode === 'edit' 
        ? apiRequest("PUT", `/api/tournaments/${tournament.id}`, tournamentData)
        : apiRequest("POST", "/api/tournaments", tournamentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: mode === 'edit' ? "Tournament updated successfully" : "Tournament added successfully",
      });
      setOpen(false);
      if (mode === 'create') {
        setFormData({
          name: "",
          description: "",
          venue: "",
          startDate: "",
          endDate: "",
          format: "",
          matchFormat: "",
          status: "upcoming",
          clubId: "",
          totalTeams: ""
        });
      }
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Tournament mutation error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.details || `Failed to ${mode} tournament`,
        variant: "destructive",
      });
    },
  });

  const createTournamentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/tournaments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
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
        venue: "",
        startDate: "",
        endDate: "",
        format: "",
        matchFormat: "",
        status: "upcoming",
        clubId: "",
        totalTeams: ""
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Tournament creation error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.details || "Failed to add tournament",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data being submitted:", formData);
    
    const tournamentData = {
      playerId: 1,
      name: formData.name,
      description: formData.description || null,
      venue: formData.venue || null,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      status: formData.status,
      format: formData.format || null,
      matchFormat: formData.matchFormat || null,
      totalTeams: formData.totalTeams ? parseInt(formData.totalTeams) : null,
      clubId: formData.clubId ? parseInt(formData.clubId) : null,
      currentPosition: null,
      points: 0,
      pointsTableImage: null
    };
    
    console.log("Tournament data being sent:", tournamentData);
    tournamentMutation.mutate(tournamentData);
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

          {/* Tournament Logo Upload */}
          <div>
            <Label htmlFor="logo">Tournament Logo</Label>
            <div className="space-y-2">
              {logoPreview ? (
                <div className="relative w-24 h-24 mx-auto">
                  <img
                    src={logoPreview}
                    alt="Tournament logo preview"
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    onClick={removeLogo}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="text-sm"
              />
              <p className="text-xs text-gray-500">Upload a logo for the tournament (optional)</p>
            </div>
          </div>

          <div>
            <Label htmlFor="clubId">Club</Label>
            <Select value={formData.clubId} onValueChange={(value) => setFormData({ ...formData, clubId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select club" />
              </SelectTrigger>
              <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                {clubs?.map((club: any) => (
                  <SelectItem key={club.id} value={club.id.toString()}>
                    {club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Tournament location/venue"
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="format">Tournament Format</Label>
              <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                  <SelectItem value="League">League</SelectItem>
                  <SelectItem value="Knockout">Knockout</SelectItem>
                  <SelectItem value="Round Robin">Round Robin</SelectItem>
                  <SelectItem value="Group Stage">Group Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="matchFormat">Match Format</Label>
              <Select value={formData.matchFormat} onValueChange={(value) => setFormData({ ...formData, matchFormat: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                  <SelectItem value="5v5">5v5</SelectItem>
                  <SelectItem value="7v7">7v7</SelectItem>
                  <SelectItem value="9v9">9v9</SelectItem>
                  <SelectItem value="11v11">11v11</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="totalTeams">Total Teams</Label>
              <Input
                id="totalTeams"
                type="number"
                min="2"
                value={formData.totalTeams}
                onChange={(e) => setFormData({ ...formData, totalTeams: e.target.value })}
                placeholder="e.g., 8, 16"
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
              disabled={tournamentMutation.isPending || !formData.clubId}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600"
            >
              {tournamentMutation.isPending 
                ? (mode === 'edit' ? "Updating..." : "Adding...") 
                : (mode === 'edit' ? "Update Tournament" : "Add Tournament")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}