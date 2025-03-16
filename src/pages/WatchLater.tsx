import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { videoApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Clock, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { Skeleton } from '@/components/ui/skeleton';
import VideoCard from '@/components/video/VideoCard';

const WatchLater = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast.error('You need to be logged in to view your Watch Later list');
    }
  }, [isAuthenticated, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ['watchLater'],
    queryFn: () => videoApi.getVideos({ watchLater: true }),
    enabled: isAuthenticated,
  });

  const videos = data?.data || [];

  if (!isAuthenticated) {
    return null;
  }

  const handleClearWatchLater = () => {
    toast.success('Watch Later list cleared');
    // Implement actual API call to clear watch later list
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <h1 className="text-2xl font-bold">Watch Later</h1>
            <span className="text-muted-foreground ml-2">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'}
            </span>
          </div>
          
          {videos.length > 0 && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleClearWatchLater}
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
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
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: any) => (
              <VideoCard key={video._id} {...video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Your Watch Later list is empty</h3>
            <p className="text-muted-foreground mb-6">Save videos to watch later</p>
            <Button onClick={() => navigate('/')}>
              Browse videos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchLater;