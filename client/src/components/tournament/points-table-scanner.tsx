import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Eye, Loader2, Trophy, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface PointsTableScannerProps {
  tournamentId: number;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function PointsTableScanner({ tournamentId, trigger, onSuccess }: PointsTableScannerProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<{position: number, points: number} | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/tournaments/${tournamentId}/scan-points-table`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to scan points table');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setScannedData(data);
      toast({
        title: "Success",
        description: `Position ${data.position} and ${data.points} points detected!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to scan points table. Please try again.",
        variant: "destructive",
      });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: () => apiRequest(`/api/tournaments/${tournamentId}`, {
      method: "PATCH",
      body: JSON.stringify({
        currentPosition: scannedData?.position,
        points: scannedData?.points,
      }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: "Tournament updated with scanned data!",
      });
      setOpen(false);
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tournament",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setScannedData(null);
    }
  };

  const handleScan = () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('pointsTable', selectedFile);
    uploadMutation.mutate(formData);
  };

  const handleConfirm = () => {
    if (scannedData) {
      confirmMutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Scan Points Table
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Scan Points Table
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="pointsTable">Upload Points Table Image</Label>
            <Input
              id="pointsTable"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload a clear image of the tournament points table
            </p>
          </div>

          {preview && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">Image Preview</span>
                </div>
                <img 
                  src={preview} 
                  alt="Points table preview" 
                  className="w-full max-h-64 object-contain rounded border"
                />
              </div>

              {!scannedData && (
                <Button 
                  onClick={handleScan} 
                  disabled={uploadMutation.isPending}
                  className="w-full"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Scan for Position & Points
                    </>
                  )}
                </Button>
              )}

              {scannedData && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Scanned Results</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">#{scannedData.position}</div>
                        <div className="text-sm text-green-700">Position</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{scannedData.points}</div>
                        <div className="text-sm text-green-700">Points</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setScannedData(null)}
                      className="flex-1"
                    >
                      Scan Again
                    </Button>
                    <Button 
                      onClick={handleConfirm}
                      disabled={confirmMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {confirmMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Confirm & Update'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}