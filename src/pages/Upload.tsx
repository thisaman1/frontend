import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload as UploadIcon, X, FileVideo, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  videoFile: z.any().refine((file) => file instanceof File, {
    message: 'Video file is required',
  }),
  thumbnail: z.any().refine((file) => file instanceof File, {
    message: 'Thumbnail is required',
  }),
  category: z.string().min(1, 'Please select a category'),
});

const categories = [
  { value: 'music', label: 'Music' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'news', label: 'News' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
  { value: 'fashion', label: 'Fashion' },
];

const Upload = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
    },
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast.error('You need to be logged in to upload videos');
    }
  }, [isAuthenticated, navigate]);

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast.error('Video file size must be less than 100MB');
      return;
    }

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, WebM, or Ogg)');
      return;
    }

    form.setValue('videoFile', file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Thumbnail file size must be less than 2MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    form.setValue('thumbnail', file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);
      
      // This is where you would typically upload the video and thumbnail
      // Create a FormData object to send to the API
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('videoFile', values.videoFile);
      formData.append('thumbnail', values.thumbnail);
      formData.append('category', values.category);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Video uploaded successfully!');
      navigate('/mychannel');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Prevent rendering if not authenticated
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - File uploads */}
            <div className="space-y-6">
              {/* Video Upload */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Video File</h2>
                  
                  {!videoPreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <input
                        type="file"
                        id="videoFile"
                        accept="video/mp4,video/webm,video/ogg"
                        className="hidden"
                        onChange={handleVideoChange}
                      />
                      <label
                        htmlFor="videoFile"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <FileVideo className="h-12 w-12 text-gray-400 mb-3" />
                        <span className="text-base font-medium mb-1">Click to upload a video</span>
                        <span className="text-sm text-muted-foreground">MP4, WebM or Ogg (Max 100MB)</span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-auto rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        type="button"
                        onClick={() => {
                          setVideoPreview(null);
                          form.setValue('videoFile', null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {form.formState.errors.videoFile && (
                    <p className="text-destructive text-sm mt-2">
                      {form.formState.errors.videoFile.message?.toString()}
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Thumbnail Upload */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Thumbnail</h2>
                  
                  {!thumbnailPreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                      <label
                        htmlFor="thumbnail"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-base font-medium mb-1">Upload thumbnail</span>
                        <span className="text-sm text-muted-foreground">JPEG, PNG or WebP (Max 2MB)</span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-auto rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        type="button"
                        onClick={() => {
                          setThumbnailPreview(null);
                          form.setValue('thumbnail', null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {form.formState.errors.thumbnail && (
                    <p className="text-destructive text-sm mt-2">
                      {form.formState.errors.thumbnail.message?.toString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Video details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Video Details</h2>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Video title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Choose a descriptive title for your video
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your video" 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Tell viewers about your video
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the category that best fits your video
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/mychannel')}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Upload Video</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Upload;