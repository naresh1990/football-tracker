import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  FileText,
  ExternalLink,
  Dumbbell
} from "lucide-react";
import type { GalleryPhoto } from "@shared/schema";
import moment from "moment-timezone";
import EmptyState from "@/components/ui/empty-state";

export default function Gallery() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<{[key: string]: string}>({});
  const [linkedSession, setLinkedSession] = useState<string>('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["/api/gallery"],
  });

  const { data: trainingSessions = [] } = useQuery({
    queryKey: ["/api/training"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { photos: File[]; captions: {[key: string]: string}; sessionId?: string }) => {
      const uploadPromises = data.photos.map(async (photo) => {
        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('playerId', '1');
        formData.append('caption', data.captions[photo.name] || '');
        if (data.sessionId) {
          formData.append('trainingSessionId', data.sessionId);
        }
        
        const response = await fetch('/api/gallery', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed for ${photo.name}`);
        }
        
        return response.json();
      });
      
      return Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setShowUploadDialog(false);
      setUploadFiles([]);
      setPhotoCaptions({});
      setLinkedSession('');
      toast({
        title: "Photos uploaded",
        description: `${results.length} photo(s) have been added to the gallery`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photos. Please try again.",
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

  const handleUpload = () => {
    if (uploadFiles.length > 0) {
      uploadMutation.mutate({
        photos: uploadFiles,
        captions: photoCaptions,
        sessionId: linkedSession && linkedSession !== 'none' ? linkedSession : undefined,
      });
    }
  };

  // Group photos by date
  const photosByDate = photos.reduce((groups: any, photo: any) => {
    const date = moment.tz(photo.uploadedAt, 'Asia/Kolkata').format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(photo);
    return groups;
  }, {});

  const sortedDates = Object.keys(photosByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleDelete = (photoId: number) => {
    deleteMutation.mutate(photoId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3">
            <Camera className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Session Gallery
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Capture and share your football moments, organized by date with optional training session links
          </p>
          
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload Photos
          </Button>
        </motion.div>

        {photos.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="No photos yet"
            description="Start building your football photo collection by uploading your first photos"
            action={
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Your First Photo
              </Button>
            }
          />
        ) : (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {sortedDates.map((date) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {moment(date).format('MMMM DD, YYYY')}
                  </h3>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500">
                    {photosByDate[date].length} photo{photosByDate[date].length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {photosByDate[date].map((photo: any, index: number) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-0">
                          <div 
                            className="relative aspect-square overflow-hidden rounded-t-lg"
                            onClick={() => setSelectedPhoto(photo)}
                          >
                            <img
                              src={`/uploads/${photo.filename}`}
                              alt={photo.caption || photo.originalName}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                          </div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(photo.id);
                              }}
                              className="w-8 h-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {(photo.caption || photo.uploadedAt || photo.trainingSessionId) && (
                            <div className="p-4 space-y-2">
                              {photo.caption && (
                                <div className="flex items-start gap-2">
                                  <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-gray-700 line-clamp-2">{photo.caption}</p>
                                </div>
                              )}
                              {photo.trainingSessionId && (
                                <div className="flex items-center gap-2">
                                  <Dumbbell className="w-3 h-3 text-blue-500" />
                                  <span className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                                        onClick={() => window.location.href = '/training'}>
                                    View Training Session
                                    <ExternalLink className="w-3 h-3" />
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {moment.tz(photo.uploadedAt, 'Asia/Kolkata').format('h:mm A')}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Photos
              </DialogTitle>
              <DialogDescription>
                Add multiple photos to your gallery with optional captions and training session links.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[50vh] overflow-y-auto border rounded-lg p-4">
              <div>
                <Label htmlFor="photo-upload">Select Photos</Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const validFiles = files.filter(file => file.type.startsWith('image/'));
                    
                    if (validFiles.length !== files.length) {
                      toast({
                        title: "Invalid file types",
                        description: "Some files were skipped. Please select only image files.",
                        variant: "destructive",
                      });
                    }
                    
                    setUploadFiles(validFiles);
                    // Initialize captions for new photos
                    const newCaptions: {[key: string]: string} = {};
                    validFiles.forEach(file => {
                      newCaptions[file.name] = '';
                    });
                    setPhotoCaptions(newCaptions);
                  }}
                  className="mt-1"
                />
                {uploadFiles.length > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {uploadFiles.length} photo(s)
                  </p>
                )}
              </div>

              {uploadFiles.length > 0 && (
                <div>
                  <Label htmlFor="session-link">Link to Training Session (optional)</Label>
                  <Select value={linkedSession} onValueChange={setLinkedSession}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a training session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No session link</SelectItem>
                      {trainingSessions.map((session: any) => (
                        <SelectItem key={session.id} value={session.id.toString()}>
                          {session.type} - {moment.tz(session.date, 'Asia/Kolkata').format('MMM DD, YYYY')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {uploadFiles.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Photo Captions</Label>
                  <div className="space-y-3">
                    {uploadFiles.map((photo, index) => (
                      <div key={`${photo.name}-${index}`} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm font-medium truncate">{photo.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            ({(photo.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <Textarea
                          placeholder={`Caption for ${photo.name} (optional)...`}
                          value={photoCaptions[photo.name] || ''}
                          onChange={(e) => setPhotoCaptions(prev => ({
                            ...prev,
                            [photo.name]: e.target.value
                          }))}
                          rows={2}
                          className="text-sm resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false);
                  setUploadFiles([]);
                  setPhotoCaptions({});
                  setLinkedSession('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={uploadMutation.isPending || uploadFiles.length === 0}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {uploadMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading {uploadFiles.length} photo(s)...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {uploadFiles.length > 0 ? uploadFiles.length : ''} Photo{uploadFiles.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Photo Modal */}
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {moment.tz(selectedPhoto.uploadedAt, 'Asia/Kolkata').format('MMMM DD, YYYY [at] h:mm A')}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(selectedPhoto.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={`/uploads/${selectedPhoto.filename}`}
                    alt={selectedPhoto.caption || selectedPhoto.originalName}
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                </div>
                {selectedPhoto.caption && (
                  <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                    <p className="text-gray-700">{selectedPhoto.caption}</p>
                  </div>
                )}
                {selectedPhoto.trainingSessionId && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Dumbbell className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-700">Linked to training session</span>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => window.location.href = '/training'}
                      className="text-blue-600 p-0 h-auto"
                    >
                      View Session <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}