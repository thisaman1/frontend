
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoApi, commentApi, likeApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import VideoPlayer from '@/components/video/VideoPlayer';
import VideoCard, { VideoCardProps } from '@/components/video/VideoCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, set } from 'date-fns';
import { toast } from "sonner";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  MessageSquare,
  Bell 
} from 'lucide-react';
import AuthForms from '@/components/auth/AuthForms';

type Video = {
  _id: string;
  title: string;
  description: string;
  videoFile: string[];
  thumbnail: string[];
  duration: number;
  views: number;
  likesCount: number;
  subscribersCount: number;
  dislikes: number;
  createdAt: string;
  ownerDetails: {
    _id: string;
    userName: string;
    avatar?: string[];
  };
};

type Comment = {
  _id: string;
  content: string;
  createdAt: string;
  likes: number;
  ownerDetails: {
    _id: string;
    userName: string;
    avatar?: string[];
  };
};

const Watch = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { isAuthenticated, user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoCardProps[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [refreshComments, setRefreshComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;
      
      setLoading(true);
      try {
        const response = await videoApi.getVideoById(videoId);
        setVideo(response.data[0]);
        setTotalLikes(response.data[0].likesCount);
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error('Failed to load video. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);


  useEffect(() => { 
    const fetchComments = async () => {
      if(video){
        try {
          const response = await commentApi.getVideoComments({
            params: { videoId: video._id }
          });
          // console.log('Fetched comments:', response.data[0]);
          setComments(response.data[0].comments);
          setTotalComments(comments.length);
        } catch (error) {
          console.error('Error fetching comments:', error);
          toast.error('Failed to load comments. Please try again later.');
        }
      }
    };
    fetchComments();
  }, [video,refreshComments]);

  const handleLike = async() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like videos');
      return;
    }
    
    try {
      const response = await likeApi.toggleVideoLike(videoId);
      setIsLiked(response.data.isLiked);
      if(isDisliked){
        setIsDisliked(false);
      }
      setTotalLikes((prev)=> response.data.isLiked ? prev + 1 : prev - 1);
      toast.success(response.data.isLiked ? 'Added like' : 'Removed like');
    }
    catch (error) {
      console.error('Error adding like:', error);
      toast.error('Failed to add like. Please try again later.');
    }
  };

  const handleCommentLike = async(commentId:string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like comments');
      return;
    }

    try {
      const response = await likeApi.toggleCommentLike(commentId);
      setRefreshComments((prev)=> !prev);
    }
    catch (error) {
      console.error('Error adding like:', error);
      toast.error('Failed to add like. Please try again later.');
    }
    // In a real app, you would make an API call to update the comment like status
    // toast.success('Liked comment');
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to dislike videos');
      return;
    }
    
    setIsDisliked(!isDisliked);
    if (isLiked) {
      setIsLiked(false);
    }
    
    // In a real app, you would make an API call to update the dislike status
    toast.success(isDisliked ? 'Removed dislike' : 'Added dislike');
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save videos');
      return;
    }
    
    setIsSaved(!isSaved);
    
    // In a real app, you would make an API call to update the saved status
    toast.success(isSaved ? 'Removed from saved videos' : 'Added to saved videos');
  };

  const handleShare = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe to channels');
      return;
    }
    
    setIsSubscribed(!isSubscribed);
    
    // In a real app, you would make an API call to update the subscription status
    toast.success(isSubscribed ? 'Unsubscribed from channel' : 'Subscribed to channel');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to comment');
      return;
    }
    
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    const newComment = async () => {
      try {
        const response = await commentApi.addVideoComment({
          params:{
            videoId: videoId,
            content: commentText,
          }
        });
        // console.log('Added comment:', response);
        setRefreshComments((prev)=> !prev);
        // setComments([response.data.data[0], ...comments]);
        setCommentText('');
        toast.success('Comment added');
      } catch (error) {
        console.error('Error adding comment:', error);
        toast.error('Failed to add comment. Please try again later.');
      }
    };

    newComment();

  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="mt-4 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </div>
          <div className="lg:w-96 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-24 w-40 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4 mt-2" />
                  <Skeleton className="h-3 w-1/2 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Video not found</h1>
          <p className="mt-2 text-muted-foreground">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Go back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {/* Video Player */}
          <div className="rounded-lg overflow-hidden">
            <VideoPlayer src={video.videoFile[0]} poster={video.thumbnail[0]} />
          </div>
          
          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-xl sm:text-2xl font-bold">{video.title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
              <div className="flex items-center gap-4">
                <Link to={`/channel/${video.ownerDetails._id}`} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={video.ownerDetails.avatar[0]} alt={video.ownerDetails.userName} />
                    <AvatarFallback>{video.ownerDetails.userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">{video.ownerDetails.userName || video.ownerDetails.userName}</h3>
                    <p className="text-sm text-muted-foreground">{formatNumber(video.subscribersCount)} subscribers</p>
                  </div>
                </Link>
                
                <Button
                  variant={isSubscribed ? "outline" : "default"}
                  size="sm"
                  className={isSubscribed ? "gap-2" : ""}
                  onClick={handleSubscribe}
                >
                  {isSubscribed && <Bell className="h-4 w-4" />}
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex rounded-full bg-secondary">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-l-full gap-2 ${isLiked ? 'text-primary font-medium' : ''}`}
                    onClick={handleLike}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{formatNumber(totalLikes)}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-r-full gap-2 ${isDisliked ? 'text-primary font-medium' : ''}`}
                    onClick={handleDislike}
                  >
                    <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  className={`rounded-full gap-2 ${isSaved ? 'text-primary font-medium' : ''}`}
                  onClick={handleSave}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Video Details */}
            <div className="mt-6 bg-secondary/50 rounded-lg p-4">
              <div className="flex gap-2 text-sm mb-2">
                <span className="font-medium">{formatNumber(video.views)} views</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
              </div>
              
              <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList className="bg-transparent border-b w-full justify-start space-x-6 rounded-none px-0 h-auto">
                  <TabsTrigger 
                    value="about" 
                    className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger 
                    value="comments" 
                    className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    Comments ({comments.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="pt-4">
                  <p className="text-sm whitespace-pre-line">{video.description}</p>
                </TabsContent>
                
                <TabsContent value="comments" className="pt-4">
                  <div className="space-y-6">
                    {/* Comment form */}
                    <div className="flex gap-4">
                      {isAuthenticated ? (
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={user?.avatar[0]} alt={user?.userName} />
                          <AvatarFallback>{user?.userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <form className="flex-1" onSubmit={handleSubmitComment}>
                        {isAuthenticated ? (
                          <>
                            <textarea
                              className="w-full resize-none border rounded-lg p-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Add a comment..."
                              rows={2}
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                            />
                            
                            {commentText && (
                              <div className="flex justify-end gap-2 mt-2">
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setCommentText('')}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" size="sm">Comment</Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:bg-secondary">
                                <span className="text-muted-foreground">Sign in to add a comment</span>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <AuthForms />
                            </DialogContent>
                          </Dialog>
                        )}
                      </form>
                    </div>
                    
                    {/* Comments list */}
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4">
                          <Link to={`/channel/${comment.ownerDetails._id}`}>
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage src={comment.ownerDetails.avatar[0]} alt={comment.ownerDetails.userName} />
                              <AvatarFallback>{comment.ownerDetails.userName.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </Link>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Link to={`/channel/${comment.ownerDetails._id}`} className="font-medium hover:underline">
                                {comment.ownerDetails.userName}
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            
                            <p className="mt-1">{comment.content}</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCommentLike(comment._id)}>
                                <ThumbsUp className="h-4 w-4" />
                                <span>{formatNumber(comment.likes)}</span>
                              </Button>
                              
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                              
                              <Button variant="ghost" size="sm" className="h-8">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Related Videos */}
        <div className="lg:w-96">
          <h3 className="text-lg font-medium mb-4">Related videos</h3>
          <div className="space-y-4">
            {relatedVideos.map((relatedVideo) => (
              <div key={relatedVideo._id} className="flex gap-2">
                <Link 
                  to={`/watch/${relatedVideo._id}`} 
                  className="flex-shrink-0 w-40 rounded-md overflow-hidden relative hover-scale"
                >
                  <img 
                    src={relatedVideo.thumbnail[0]} 
                    alt={relatedVideo.title} 
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                    {formatDuration(relatedVideo.duration)}
                  </div>
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/watch/${relatedVideo._id}`}
                    className="font-medium line-clamp-2 hover:underline"
                  >
                    {relatedVideo.title}
                  </Link>
                  
                  <Link 
                    to={`/channel/${relatedVideo.owner}`}
                    className="text-sm text-muted-foreground mt-1 hover:text-foreground block"
                  >
                    {relatedVideo.ownerDetails.userName}
                  </Link>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatViews(relatedVideo.views)} views • {formatDistanceToNow(new Date(relatedVideo.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Format duration (seconds to MM:SS)
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format view count
const formatViews = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export default Watch;
