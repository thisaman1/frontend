import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi, videoApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VideoCard from '@/components/video/VideoCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";
import { Pencil, Video, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyChannel = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast.error('You need to be logged in to access your channel');
    }
  }, [isAuthenticated, navigate]);

  const { data: channelData, isLoading: isChannelLoading } = useQuery({
    queryKey: ['channelProfile', user?._id],
    queryFn: () => userApi.getChannelProfile(user?._id || ''),
    enabled: !!user?._id && isAuthenticated,
  });

  const { data: videos, isLoading: isVideosLoading } = useQuery({
    queryKey: ['channelVideos', user?._id],
    queryFn: () => videoApi.getVideos({ userId: user?._id }),
    enabled: !!user?._id && isAuthenticated,
  });

  if (!isAuthenticated) {
    return null; // Prevent rendering if not authenticated
  }
  
  return (
    <div className="container mx-auto p-4">
      {isChannelLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-lg" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cover Image */}
          <div 
            className="h-40 w-full rounded-lg bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${channelData?.data[0]?.coverImage?.[0] || ''})`,
              backgroundColor: !channelData?.data[0]?.coverImage?.[0] ? 'hsl(var(--muted))' : undefined
            }}
          />
          
          {/* Channel Info */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={channelData?.data[0]?.avatar?.[0]} />
              <AvatarFallback className="text-2xl">
                {user?.userName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{channelData?.data?.userName || user?.userName}</h1>
              <p className="text-muted-foreground">
                {videos?.data?.videos.length || 0} videos
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/upload')}>
                <Video className="h-4 w-4" />
                Upload
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Channel
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
          
          {/* Channel Content */}
          <Tabs defaultValue="videos" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              {isVideosLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                      <Skeleton className="w-full aspect-video rounded-lg" />
                      <div className="flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : videos?.data.videos && videos.data.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                  {videos.data.videos.map((video) => (
                    <VideoCard key={video._id} {...video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No videos yet</h3>
                  <p className="text-muted-foreground mb-6">Upload your first video to get started</p>
                  <Button onClick={() => navigate('/upload')}>
                    Upload a video
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about">
              <div className="max-w-3xl mx-auto py-6">
                <h3 className="text-lg font-medium mb-4">About {channelData?.data?.userName || user?.userName}</h3>
                <p className="text-muted-foreground">
                  {channelData?.data?.description || 'No channel description available.'}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default MyChannel;