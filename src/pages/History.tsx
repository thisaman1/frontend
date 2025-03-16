import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { videoApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "sonner";
import { Skeleton } from '@/components/ui/skeleton';

const History = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast.error('You need to be logged in to view your history');
    }
  }, [isAuthenticated, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ['watchHistory'],
    queryFn: async() => await videoApi.getVideos({ history: true }),
    enabled: isAuthenticated,
  });

  const videos = data?.data.videos || [];

  if (!isAuthenticated) {
    return null;
  }
// console.log(videos);
  // Group videos by date
  const groupedVideos = videos.reduce((acc: Record<string, any[]>, video: any) => {
    const date = new Date(video.watchedAt || video.createdAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(video);
    return acc;
  }, {});

  const handleClearHistory = () => {
    toast.success('Watch history cleared');
    // Implement actual API call to clear history
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Watch History</h1>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleClearHistory}
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, dateIndex) => (
            <div key={dateIndex} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Separator />
              
              {Array.from({ length: 3 }).map((_, videoIndex) => (
                <div key={videoIndex} className="flex gap-4">
                  <Skeleton className="h-24 w-40 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedVideos).map(([date, videos]) => (
            <div key={date} className="space-y-4">
              <h2 className="font-medium text-lg">
                {format(new Date(date), 'MMMM d, yyyy')}
              </h2>
              <Separator />
              
              <div className="space-y-4">
                {videos.map((video: any) => (
                  <div 
                    key={video._id} 
                    className="flex flex-col sm:flex-row gap-4 cursor-pointer hover:bg-accent/20 p-2 rounded-md transition-colors"
                    onClick={() => navigate(`/watch/${video._id}`)}
                  >
                    <div className="relative sm:w-40 aspect-video flex-shrink-0">
                      <img 
                        src={video.thumbnail[0]} 
                        alt={video.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{video.ownerDetails.userName}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {video.views} views • {format(new Date(video.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Your watch history is empty</h3>
          <p className="text-muted-foreground mb-6">Videos you watch will appear here</p>
          <Button onClick={() => navigate('/')}>
            Browse videos
          </Button>
        </div>
      )}
    </div>
  );
};

export default History;