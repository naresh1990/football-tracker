import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertClubSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Upload, X } from "lucide-react";

const clubFormSchema = insertClubSchema.extend({
  seasonStart: z.string().optional(),
  seasonEnd: z.string().optional(),
});

type ClubFormData = z.infer<typeof clubFormSchema>;

interface ClubFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editData?: any;
}

export default function ClubForm({ onSuccess, onCancel, editData }: ClubFormProps) {
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(editData?.logo || null);
  
  const form = useForm<ClubFormData>({
    resolver: zodResolver(clubFormSchema),
    defaultValues: editData ? {
      playerId: editData.playerId || 1,
      name: editData.name || "",
      type: editData.type || "primary",
      squadLevel: editData.squadLevel || "",
      seasonStart: editData.seasonStart ? new Date(editData.seasonStart).toISOString().split('T')[0] : "",
      seasonEnd: editData.seasonEnd ? new Date(editData.seasonEnd).toISOString().split('T')[0] : "",
      status: editData.status || "active",
      description: editData.description || "",
    } : {
      playerId: 1,
      name: "",
      type: "primary",
      squadLevel: "",
      seasonStart: "",
      seasonEnd: "",
      status: "active",
      description: "",
    },
  });

  const clubMutation = useMutation({
    mutationFn: (data: ClubFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (key === 'seasonStart' || key === 'seasonEnd') {
            formData.append(key, value ? new Date(value).toISOString() : '');
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      const url = editData ? `/api/clubs/${editData.id}` : '/api/clubs';
      const method = editData ? 'PUT' : 'POST';
      
      return fetch(url, {
        method,
        body: formData,
      }).then(res => {
        if (!res.ok) throw new Error(`Failed to ${editData ? 'update' : 'create'} club`);
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      toast({
        title: "Success",
        description: `Club ${editData ? 'updated' : 'added'} successfully`,
      });
      if (!editData) form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${editData ? 'update' : 'add'} club`,
        variant: "destructive",
      });
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
    setLogoPreview(null);
  };

  const onSubmit = (data: ClubFormData) => {
    clubMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 shadow-lg">
      <CardHeader className="bg-white">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {editData ? "Edit Club" : "Add Club"}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sporthood" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select club type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary">Primary Club</SelectItem>
                        <SelectItem value="adhoc">Adhoc Club</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="squadLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Squad Level (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., U10 Elite Squad Training" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seasonStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season Start (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seasonEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season End (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Club description and notes..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Club Logo Upload */}
            <div className="space-y-3">
              <FormLabel>Club Logo</FormLabel>
              <div className="flex items-center space-x-4">
                {logoPreview ? (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload club logo (PNG, JPG, max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={clubMutation.isPending}
              >
                {clubMutation.isPending ? (editData ? "Updating..." : "Adding...") : (editData ? "Update Club" : "Add Club")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}