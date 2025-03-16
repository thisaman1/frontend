import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { likeApi, videoApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { toast } from "sonner";
import { Skeleton } from '@/components/ui/skeleton';
import VideoCard from '@/components/video/VideoCard';

const LikedVideos = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast.error('You need to be logged in to view your liked videos');
    }
  }, [isAuthenticated, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ['likedVideos'],
    queryFn: () => likeApi.getAllLikedVideos(),
    enabled: isAuthenticated,
  });

  const videos = data?.data || [];

  if (!isAuthenticated) {
    return null;
  }
  // console.log(data);
  // console.log(videos);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <ThumbsUp className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Liked Videos</h1>
          <span className="text-muted-foreground ml-2">
            {videos.length} {videos.length === 1 ? 'video' : 'videos'}
          </span>
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
              // console.log(video),
              <VideoCard key={video._id} {...video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">You haven't liked any videos yet</h3>
            <p className="text-muted-foreground mb-6">Videos you like will appear here</p>
            <Button onClick={() => navigate('/')}>
              Browse videos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedVideos;