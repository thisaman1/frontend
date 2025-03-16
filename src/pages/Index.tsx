
import React, { useState, useEffect } from 'react';
import { videoApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import VideoCard, { VideoCardProps } from '@/components/video/VideoCard';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await videoApi.getVideos({
          params: { category: activeTab !== 'all' ? activeTab : undefined }
        });
        setVideos(response.data.videos);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // const generateMockVideos = () => {
    //   const categories = ['music', 'gaming', 'news', 'tech', 'cooking', 'travel'];
    //   const mockVideos: VideoCardProps[] = Array.from({ length: 12 }, (_, i) => ({
    //     _id: `mock-${i}`,
    //     title: `Sample Video ${i + 1} - ${activeTab !== 'all' ? activeTab : categories[i % categories.length]} content that's trending right now`,
    //     thumbnail: `https://picsum.photos/id/${i + 10}/640/360`,
    //     duration: Math.floor(Math.random() * 600) + 60, // 1-10 minutes
    //     views: Math.floor(Math.random() * 1000000),
    //     createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(), // 0-30 days ago
    //     channel: {
    //       _id: `channel-${i % 5}`,
    //       username: `Creator${i % 5}`,
    //       avatar: `https://i.pravatar.cc/150?img=${i % 5 + 10}`,
    //     },
    //   }));
    //   setVideos(mockVideos);
    // };

    fetchVideos();
  }, [activeTab]);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'music', label: 'Music' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'news', label: 'News' },
    { value: 'tech', label: 'Tech' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'travel', label: 'Travel' },
  ];

  return (
    <div className="flex">
      <div className="hidden md:block">
        {/* <Sidebar /> */}
      </div>
      <main className="flex-1 min-h-screen p-4 md:p-6">
        <div className="mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full justify-start overflow-x-auto whitespace-nowrap space-x-2 px-0 h-auto">
              {categories.map(category => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="rounded-full py-1 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category.value} value={category.value} className="mt-0">
                {error && (
                  <div className="text-center text-destructive p-4 my-4 rounded-lg bg-destructive/10">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {loading
                    ? Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="aspect-video rounded-lg" />
                          <div className="flex gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-3 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        </div>
                      ))
                    : videos.map((video) => (
                        // console.log(video),
                        <VideoCard key={video._id} {...video} />
                      ))
                  }
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
