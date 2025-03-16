import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { videoApi } from '@/services/api';
import VideoCard from '@/components/video/VideoCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, Music, Film, Gamepad2, Newspaper, Trophy, Lightbulb, ShoppingBag } from 'lucide-react';

const categories = [
  { id: 'trending', label: 'Trending', icon: <Flame className="h-4 w-4" /> },
  { id: 'music', label: 'Music', icon: <Music className="h-4 w-4" /> },
  { id: 'movies', label: 'Movies', icon: <Film className="h-4 w-4" /> },
  { id: 'gaming', label: 'Gaming', icon: <Gamepad2 className="h-4 w-4" /> },
  { id: 'news', label: 'News', icon: <Newspaper className="h-4 w-4" /> },
  { id: 'sports', label: 'Sports', icon: <Trophy className="h-4 w-4" /> },
  { id: 'learning', label: 'Learning', icon: <Lightbulb className="h-4 w-4" /> },
  { id: 'fashion', label: 'Fashion', icon: <ShoppingBag className="h-4 w-4" /> },
];

const Explore = () => {
  const [activeCategory, setActiveCategory] = React.useState('trending');

  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos', activeCategory],
    queryFn: () => videoApi.getVideos({ category: activeCategory }),
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      
      <Tabs defaultValue="trending" onValueChange={setActiveCategory}>
        <TabsList className="mb-6 flex flex-wrap">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
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
            ) : videos?.data && videos.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.data.map((video) => (
                  <VideoCard key={video._id} {...video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>No videos found in this category.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Explore;