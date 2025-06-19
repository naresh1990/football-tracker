import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertCoachSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
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
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const coachFormSchema = insertCoachSchema.extend({
  clubId: z.number().optional(),
});

type CoachFormData = z.infer<typeof coachFormSchema>;

interface CoachFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  clubId?: number;
  coach?: any; // For editing existing coach
  trigger?: React.ReactNode;
}

export default function CoachForm({ onSuccess, onCancel, clubId, coach, trigger }: CoachFormProps) {
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
  
  const form = useForm<CoachFormData>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      playerId: 1,
      clubId: clubId || coach?.clubId,
      name: coach?.name || "",
      title: coach?.title || "Head Coach",
      contact: coach?.contact || "",
      isActive: coach?.isActive ?? true,
    },
  });

  const createCoachMutation = useMutation({
    mutationFn: (data: CoachFormData) => {
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
      
      const url = coach ? `/api/coaches/${coach.id}` : '/api/coaches';
      const method = coach ? 'PUT' : 'POST';
      
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
      queryClient.invalidateQueries({ queryKey: ["/api/coaches"] });
      toast({
        title: "Success",
        description: coach ? "Coach updated successfully" : "Coach added successfully",
      });
      form.reset();
      resetImageState();
      setOpen(false);
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: coach ? "Failed to update coach" : "Failed to add coach",
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

  const onSubmit = (data: CoachFormData) => {
    createCoachMutation.mutate(data);
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
                <FormLabel>Coach Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Coach Martinez" {...field} />
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
                  disabled={!!clubId || !!coach}
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

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coach Title</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coach title" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-[9999] max-h-[200px] bg-white" position="popper" sideOffset={4}>
                  <SelectItem value="Head Coach">Head Coach</SelectItem>
                  <SelectItem value="Assistant Coach">Assistant Coach</SelectItem>
                  <SelectItem value="Adhoc Coach">Adhoc Coach</SelectItem>
                  <SelectItem value="Fitness Coach">Fitness Coach</SelectItem>
                  <SelectItem value="Goalkeeping Coach">Goalkeeping Coach</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Information</FormLabel>
              <FormControl>
                <Input placeholder="Phone number or email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Crop Image
                </Button>
              )}
            </div>
          </div>
        </div>

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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Apply Crop
                </Button>
              </div>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Coach</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Coach is currently active and available for selection
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

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
            disabled={createCoachMutation.isPending}
          >
            {createCoachMutation.isPending 
              ? (coach ? "Updating..." : "Adding...") 
              : (coach ? "Update Coach" : "Add Coach")
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
              <span className="text-2xl">👨‍🏫</span>
              {coach ? "Edit Coach" : "Add New Coach"}
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
          <span className="text-2xl">👨‍🏫</span>
          {coach ? "Edit Coach" : "Add New Coach"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}