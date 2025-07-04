import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: club?.name || "",
    type: club?.type || "",
    level: club?.squadLevel || "",
    status: club?.status || "active",
    seasonStart: club?.seasonStart ? new Date(club.seasonStart).toISOString().split('T')[0] : "",
    seasonEnd: club?.seasonEnd ? new Date(club.seasonEnd).toISOString().split('T')[0] : "",
    description: club?.description || "",
    logo: club?.logo || ""
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(club?.logo || "");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a local URL for preview
      const fileUrl = URL.createObjectURL(file);
      setFormData({ ...formData, logo: fileUrl });
      
      toast({
        title: "Logo uploaded",
        description: "Logo has been set for preview. Note: This is a temporary URL.",
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const createClubMutation = useMutation({
    mutationFn: async (data: any) => {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(data).forEach(key => {
        if (key !== 'logoFile' && data[key] !== null && data[key] !== undefined) {
          formDataToSend.append(key, data[key]);
        }
      });
      
      // Handle logo file upload
      if (data.logoFile) {
        formDataToSend.append('logo', data.logoFile);
      }
      
      const url = mode === 'edit' && club ? `/api/clubs/${club.id}` : "/api/clubs";
      const method = mode === 'edit' && club ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
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
        setLogoFile(null);
        setLogoPreview("");
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
    
    const submitData = {
      playerId: 1,
      name: formData.name,
      type: formData.type,
      squadLevel: formData.level || null,
      seasonStart: formData.seasonStart ? new Date(formData.seasonStart).toISOString() : null,
      seasonEnd: formData.seasonEnd ? new Date(formData.seasonEnd).toISOString() : null,
      status: formData.status.toLowerCase(),
      description: formData.description || null,
      logoFile: logoFile,
    };
    
    console.log("Submitting club data:", submitData);
    createClubMutation.mutate(submitData);
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
            <span className="text-white">{mode === 'edit' ? 'Edit Club' : 'Add Club'}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white z-[9998]">
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
                <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                  <SelectItem value="Academy" className="text-gray-900 hover:bg-blue-50 hover:text-blue-900 cursor-pointer">Academy</SelectItem>
                  <SelectItem value="School Team" className="text-gray-900 hover:bg-blue-50 hover:text-blue-900 cursor-pointer">School Team</SelectItem>
                  <SelectItem value="Local Club" className="text-gray-900 hover:bg-blue-50 hover:text-blue-900 cursor-pointer">Local Club</SelectItem>
                  <SelectItem value="Professional Club" className="text-gray-900 hover:bg-blue-50 hover:text-blue-900 cursor-pointer">Professional Club</SelectItem>
                  <SelectItem value="Training Center" className="text-gray-900 hover:bg-blue-50 hover:text-blue-900 cursor-pointer">Training Center</SelectItem>
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
                <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                  <SelectItem value="active">🌟 Active (Current Club)</SelectItem>
                  <SelectItem value="inactive">Former Club</SelectItem>
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
            <Label htmlFor="logo">Club Logo (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.png or upload a file"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleUploadClick}
                title="Upload logo file"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setLogoFile(file);
                    const url = URL.createObjectURL(file);
                    setLogoPreview(url);
                    setFormData({ ...formData, logo: url });
                  }
                }}
                className="hidden"
              />
            </div>
            {logoPreview && (
              <div className="mt-2">
                <img 
                  src={logoPreview} 
                  alt="Club logo preview" 
                  className="w-16 h-16 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
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