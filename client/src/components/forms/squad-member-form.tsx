import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertSquadMemberSchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useState, useCallback, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const squadMemberFormSchema = insertSquadMemberSchema.extend({
  clubId: z.number().optional(),
});

type SquadMemberFormData = z.infer<typeof squadMemberFormSchema>;

interface SquadMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  clubId?: number;
  squadMember?: any; // For editing existing squad member
  trigger?: React.ReactNode;
}

export default function SquadMemberForm({ onSuccess, onCancel, clubId, squadMember, trigger }: SquadMemberFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { data: clubs } = useQuery({
    queryKey: ["/api/clubs", { playerId: 1 }],
  });
  
  const form = useForm<SquadMemberFormData>({
    resolver: zodResolver(squadMemberFormSchema),
    defaultValues: {
      playerId: 1,
      clubId: clubId || squadMember?.clubId,
      name: squadMember?.name || "",
      position: squadMember?.position || "Midfielder",
      jerseyNumber: squadMember?.jerseyNumber || null,
      age: squadMember?.age || null,
      notes: squadMember?.notes || "",
    },
  });

  const createSquadMemberMutation = useMutation({
    mutationFn: (data: SquadMemberFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value.toString());
        }
      });
      
      // Add profile picture if selected
      if (profileFile) {
        formData.append('profilePicture', profileFile);
      }
      
      const url = squadMember ? `/api/squad/${squadMember.id}` : '/api/squad';
      const method = squadMember ? 'PUT' : 'POST';
      
      return fetch(url, {
        method,
        body: formData,
      }).then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/squad"] });
      toast({
        title: "Success",
        description: squadMember ? "Squad member updated successfully" : "Squad member added successfully",
      });
      form.reset();
      resetImageState();
      setOpen(false);
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: squadMember ? "Failed to update squad member" : "Failed to add squad member",
        variant: "destructive",
      });
    },
  });

  const resetImageState = () => {
    setProfileFile(null);
    setProfilePreview("");
    setShowCropper(false);
    setOriginalImage("");
    setCompletedCrop(undefined);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setShowCropper(true);
    }
  };

  const getCroppedImg = useCallback(async (image: HTMLImageElement, crop: PixelCrop): Promise<File> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg', 0.9);
    });
  }, []);

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedFile = await getCroppedImg(imgRef.current, completedCrop);
        setProfileFile(croppedFile);
        const previewUrl = URL.createObjectURL(croppedFile);
        setProfilePreview(previewUrl);
        setShowCropper(false);
      } catch (error) {
        console.error('Error cropping image:', error);
        toast({
          title: "Error",
          description: "Failed to crop image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = (data: SquadMemberFormData) => {
    createSquadMemberMutation.mutate(data);
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Player Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clubId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Club *</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  value={field.value?.toString() || ""}
                  disabled={!!clubId || !!squadMember}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select club" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                    {clubs?.map((club: any) => (
                      <SelectItem key={club.id} value={club.id.toString()}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                    <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                    <SelectItem value="Defender">Defender</SelectItem>
                    <SelectItem value="Midfielder">Midfielder</SelectItem>
                    <SelectItem value="Forward">Forward</SelectItem>
                    <SelectItem value="Winger">Winger</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jerseyNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jersey Number</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="99" 
                    placeholder="7" 
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="5" 
                    max="50" 
                    placeholder="15" 
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>Profile Picture (Optional)</FormLabel>
          <div className="flex items-center gap-4 mt-2">
            {profilePreview ? (
              <div className="relative">
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={resetImageState}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xs"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
            <div className="flex-1 space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500">Upload profile picture (PNG, JPG, max 5MB)</p>
              {originalImage && !profilePreview && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCropper(true)}
                  className="w-full text-green-600 border-green-200 hover:bg-green-50"
                >
                  Crop Image
                </Button>
              )}
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Any additional notes about the player" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Cropping Modal */}
        {showCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[99999]" style={{ zIndex: 99999 }}>
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Crop Profile Picture</h3>
              <div className="mb-6 flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={setCrop}
                  onComplete={setCompletedCrop}
                  aspect={1}
                  circularCrop
                  className="border border-gray-200 rounded"
                >
                  <img
                    ref={imgRef}
                    src={originalImage}
                    alt="Crop preview"
                    className="max-h-80 w-auto rounded"
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCropper(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCropComplete}
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  Apply Crop
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={createSquadMemberMutation.isPending}
          >
            {createSquadMemberMutation.isPending 
              ? (squadMember ? "Updating..." : "Adding...") 
              : (squadMember ? "Update Player" : "Add Player")
            }
          </Button>
        </div>
      </form>
    </Form>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              {squadMember ? "Edit Squad Member" : "Add Squad Member"}
            </DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          {squadMember ? "Edit Squad Member" : "Add Squad Member"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}