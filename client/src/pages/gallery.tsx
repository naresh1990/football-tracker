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
import { Badge } from "@/components/ui/badge";
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
  Dumbbell,
  Pencil
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
  const [filterBySession, setFilterBySession] = useState<string>('all');
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [editCaption, setEditCaption] = useState<string>('');
  
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
      console.log('Deleting photo with ID:', photoId);
      const response = await apiRequest(`/api/gallery/${photoId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      console.log('Delete response:', result);
      return result;
    },
    onSuccess: (data, photoId) => {
      console.log('Delete successful for photo:', photoId);
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      setSelectedPhoto(null);
      toast({
        title: "Photo deleted",
        description: "Photo has been removed from gallery",
      });
    },
    onError: (error, photoId) => {
      console.error('Delete error for photo:', photoId, error);
      toast({
        title: "Delete failed", 
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Edit photo mutation
  const editMutation = useMutation({
    mutationFn: async ({ photoId, caption }: { photoId: number, caption: string }) => {
      return apiRequest(`/api/gallery/${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caption }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setEditingPhoto(null);
      setEditCaption('');
      toast({
        title: "Photo updated",
        description: "Photo caption has been updated",
      });
    },
    onError: (error) => {
      console.error('Edit error:', error);
      toast({
        title: "Update failed", 
        description: "Failed to update photo. Please try again.",
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

  // Filter photos by selected training session
  const filteredPhotos = filterBySession === 'all' 
    ? photos 
    : filterBySession === 'no-session'
    ? photos.filter((photo: any) => !photo.trainingSessionId)
    : photos.filter((photo: any) => photo.trainingSessionId?.toString() === filterBySession);

  // Group filtered photos by date
  const photosByDate = filteredPhotos.reduce((groups: any, photo: any) => {
    const date = moment.tz(photo.uploadedAt, 'Asia/Kolkata').format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(photo);
    return groups;
  }, {});

  const sortedDates = Object.keys(photosByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Get training sessions that have photos
  const sessionsWithPhotos = trainingSessions.filter((session: any) => 
    photos.some((photo: any) => photo.trainingSessionId === session.id)
  );

  const handleDelete = async (photoId: number) => {
    try {
      await deleteMutation.mutateAsync(photoId);
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
            <p className="text-gray-600">Your football journey in photos</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="session-filter" className="text-sm font-medium text-gray-700">Filter by:</Label>
              <Select value={filterBySession} onValueChange={setFilterBySession}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All photos" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border rounded-md">
                  <SelectItem value="all">All photos ({photos.length})</SelectItem>
                  <SelectItem value="no-session">Unlinked photos ({photos.filter((p: any) => !p.trainingSessionId).length})</SelectItem>
                  {sessionsWithPhotos.map((session: any) => {
                    const photoCount = photos.filter((p: any) => p.trainingSessionId === session.id).length;
                    return (
                      <SelectItem key={session.id} value={session.id.toString()}>
                        {session.type} - {moment.tz(session.date, 'Asia/Kolkata').format('MMM DD')} ({photoCount})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Photos
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {filteredPhotos.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title={filterBySession === 'all' ? "No photos yet" : "No photos found"}
            description={filterBySession === 'all' 
              ? "Start building your gallery by uploading your first photos"
              : "No photos found for the selected filter"
            }
            action={
              filterBySession === 'all' ? (
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photos
                    </Button>
                  </DialogTrigger>
                </Dialog>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => setFilterBySession('all')}
                >
                  Show All Photos
                </Button>
              )
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
              <div key={date} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        {moment.tz(date, 'Asia/Kolkata').format('dddd, MMMM DD, YYYY')}
                      </h2>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                      {photosByDate[date].length} photo{photosByDate[date].length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  {filterBySession !== 'all' && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      Filtered by training session
                    </Badge>
                  )}
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
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPhoto(photo);
                                setEditCaption(photo.caption || '');
                              }}
                              className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this photo?')) {
                                  handleDelete(photo.id);
                                }
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
                    <SelectContent className="bg-white shadow-lg border rounded-md">
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPhoto(selectedPhoto);
                        setEditCaption(selectedPhoto.caption || '');
                        setSelectedPhoto(null);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this photo?')) {
                          handleDelete(selectedPhoto.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
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
                      onClick={() => {
                        setFilterBySession(selectedPhoto.trainingSessionId.toString());
                        setSelectedPhoto(null);
                      }}
                      className="text-blue-600 p-0 h-auto"
                    >
                      Filter by session <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Photo Dialog */}
        {editingPhoto && (
          <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Pencil className="w-5 h-5" />
                  Edit Photo Caption
                </DialogTitle>
                <DialogDescription>
                  Update the caption for this photo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={`/uploads/${editingPhoto.filename}`}
                    alt={editingPhoto.caption || editingPhoto.originalName}
                    className="w-full max-h-48 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-caption">Caption</Label>
                  <Textarea
                    id="edit-caption"
                    placeholder="Enter photo caption..."
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingPhoto(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => editMutation.mutate({ photoId: editingPhoto.id, caption: editCaption })}
                  disabled={editMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {editMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Pencil className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}