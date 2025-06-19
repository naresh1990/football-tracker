import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Camera, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  X,
  Calendar,
  FileText
} from "lucide-react";
import type { GalleryPhoto } from "@shared/schema";
import moment from "moment-timezone";

export default function Gallery() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [uploadForm, setUploadForm] = useState({
    photo: null as File | null,
    caption: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gallery photos
  const { data: photos, isLoading } = useQuery({
    queryKey: ["/api/gallery", { playerId: 1 }],
  });

  // Upload photo mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: { photo: File; caption: string }) => {
      const formData = new FormData();
      formData.append('photo', data.photo);
      formData.append('playerId', '1');
      formData.append('caption', data.caption);
      
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setIsUploadDialogOpen(false);
      setUploadForm({ photo: null, caption: "" });
      toast({
        title: "Photo uploaded successfully",
        description: "Your photo has been added to the gallery",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete photo mutation
  const deleteMutation = useMutation({
    mutationFn: async (photoId: number) => {
      return apiRequest(`/api/gallery/${photoId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setSelectedPhoto(null);
      toast({
        title: "Photo deleted",
        description: "Photo has been removed from gallery",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed", 
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadForm(prev => ({ ...prev, photo: file }));
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = () => {
    if (!uploadForm.photo) {
      toast({
        title: "No photo selected",
        description: "Please select a photo to upload",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      photo: uploadForm.photo,
      caption: uploadForm.caption,
    });
  };

  const handleDelete = (photoId: number) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      deleteMutation.mutate(photoId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Session Gallery</h1>
              <p className="text-gray-600">Capture and share your football moments</p>
            </div>
          </div>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Photos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="photo-upload">Select Photo</Label>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="mt-1"
                  />
                  {uploadForm.photo && (
                    <p className="text-sm text-green-600 mt-1">
                      Selected: {uploadForm.photo.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="caption">Caption (optional)</Label>
                  <Textarea
                    id="caption"
                    placeholder="Add a caption for your photo..."
                    value={uploadForm.caption}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending || !uploadForm.photo}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Gallery Grid */}
        {!photos || photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos added yet</h3>
            <p className="text-gray-600 mb-6">Start building your football memories by uploading photos</p>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
              </DialogTrigger>
            </Dialog>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {photos.map((photo: GalleryPhoto, index: number) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={`/uploads/${photo.filename}`}
                        alt={photo.caption || photo.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(photo.id);
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {(photo.caption || photo.uploadedAt) && (
                      <div className="p-4 space-y-2">
                        {photo.caption && (
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700 line-clamp-2">{photo.caption}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {moment.tz(photo.uploadedAt, 'Asia/Kolkata').format('MMM DD, YYYY')}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Photo Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full w-10 h-10 p-0"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
                
                <img
                  src={`/uploads/${selectedPhoto.filename}`}
                  alt={selectedPhoto.caption || selectedPhoto.originalName}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                
                {(selectedPhoto.caption || selectedPhoto.uploadedAt) && (
                  <div className="p-6 bg-white border-t">
                    {selectedPhoto.caption && (
                      <p className="text-gray-800 mb-3 text-lg">{selectedPhoto.caption}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Uploaded: {moment.tz(selectedPhoto.uploadedAt, 'Asia/Kolkata').format('MMMM DD, YYYY [at] h:mm A')}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(selectedPhoto.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Photo
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}