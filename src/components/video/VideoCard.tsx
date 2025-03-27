
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export type VideoCardProps = {
  _id: string;
  title: string;
  thumbnail: string;
  duration: number;
  views: number;
  createdAt: string;
  owner: string;
  ownerDetails: {
    _id: string;
    userName: string;
    avatar?: string[];
  };
  className?: string;
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

// Format duration (seconds to MM:SS)
const formatDuration = (seconds: number): string => {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}.${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2,'0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2,'0')}`;
};

export const VideoCard: React.FC<VideoCardProps> = ({
  _id,
  title,
  thumbnail,
  duration,
  views,
  createdAt,
  ownerDetails,
  owner,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className={`border-none shadow-none bg-transparent ${className}`}>
      <CardContent className="p-0">
        <div className="group hover-scale">
          <Link to={`/watch/${_id}`} className="block relative rounded-lg overflow-hidden aspect-video">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 rounded-lg" />
            )}
            <img
              src={thumbnail[0]}
              alt={title}
              className="w-full h-full object-cover transition-all"
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {formatDuration(duration)}
            </div>
          </Link>
          
          <div className="flex gap-3 mt-3">
            <Link to={`/channel/${owner}`} className="flex-shrink-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={ownerDetails.avatar[0]} alt={ownerDetails.userName} />
                <AvatarFallback>{ownerDetails.userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            
            <div className="flex flex-col">
              <Link 
                to={`/watch/${_id}`}
                className="text-base font-medium line-clamp-2 text-foreground"
              >
                {title}
              </Link>
              
              <Link 
                to={`/channel/${owner}`}
                className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors"
              >
                {ownerDetails.userName}
              </Link>
              
              <div className="text-xs text-muted-foreground mt-1">
                {formatViews(views)} views • {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
