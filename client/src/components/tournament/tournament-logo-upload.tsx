import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TournamentLogoUploadProps {
  tournament: any;
  trigger?: React.ReactNode;
}

export default function TournamentLogoUpload({ tournament, trigger }: TournamentLogoUploadProps) {
  const [open, setOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(tournament?.logo || "");
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const logoUploadMutation = useMutation({
    mutationFn: async () => {
      if (!logoFile) throw new Error("No file selected");

      setIsUploading(true);
      
      try {
        // Upload logo
        const logoFormData = new FormData();
        logoFormData.append("logo", logoFile);
        
        console.log("Uploading tournament logo...", logoFile);
        
        const logoResponse = await fetch("/api/upload/tournament-logo", {
          method: "POST",
          body: logoFormData,
        });
        
        console.log("Logo upload response status:", logoResponse.status);
        
        if (!logoResponse.ok) {
          const errorData = await logoResponse.json();
          console.error("Logo upload error response:", errorData);
          throw new Error(errorData.error || "Failed to upload logo");
        }
        
        const result = await logoResponse.json();
        console.log("Logo upload result:", result);
        
        if (!result.filePath) {
          throw new Error("No file path returned from upload");
        }
        
        // Update tournament with new logo
        const updateData = {
          playerId: tournament.playerId,
          clubId: tournament.clubId,
          name: tournament.name,
          description: tournament.description,
          venue: tournament.venue,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
          status: tournament.status,
          format: tournament.format,
          matchFormat: tournament.matchFormat,
          totalTeams: tournament.totalTeams,
          currentPosition: tournament.currentPosition,
          points: tournament.points,
          pointsTableImage: tournament.pointsTableImage,
          logo: result.filePath
        };
        
        console.log("Updating tournament with data:", updateData);
        
        return apiRequest("PUT", `/api/tournaments/${tournament.id}`, updateData);
      } catch (error) {
        console.error("Logo upload mutation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", tournament.id] });
      toast({
        title: "Success",
        description: "Tournament logo updated successfully",
      });
      setOpen(false);
      setLogoFile(null);
      setIsUploading(false);
    },
    onError: (error: any) => {
      console.error("Logo upload error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update tournament logo",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const removeLogoMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", `/api/tournaments/${tournament.id}`, {
        ...tournament,
        logo: null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", tournament.id] });
      toast({
        title: "Success",
        description: "Tournament logo removed successfully",
      });
      setOpen(false);
      setLogoPreview("");
    },
    onError: (error: any) => {
      console.error("Logo removal error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to remove tournament logo",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (logoFile) {
      logoUploadMutation.mutate();
    } else if (!logoPreview && tournament.logo) {
      removeLogoMutation.mutate();
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Edit Logo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tournament Logo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {logoPreview ? (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Tournament logo preview"
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  onClick={removeLogo}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No logo</p>
                </div>
              </div>
            )}
            
            <div className="w-full">
              <Label htmlFor="logo-file" className="text-sm font-medium">
                Upload New Logo
              </Label>
              <Input
                id="logo-file"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: Square image, at least 200x200 pixels
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}