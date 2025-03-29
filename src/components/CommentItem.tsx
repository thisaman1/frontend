import react,{useState} from "react";
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow, set } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { likeApi,commentApi } from "@/services/api";
import { 
    ThumbsUp, 
    ThumbsDown,
    Loader
  } from 'lucide-react';
export const CommentItem = ({ 
    comment, 
    replies={}, 
    onFetchReplies,
    onSubmitReply,
    activeReplyId, 
    setActiveReplyId,
    depth 
  }) => {
    const { isAuthenticated,user } = useAuth();
    const maxDepth = 5; // Prevent infinite nesting
    const marginLeft = depth * 24; // 24px indentation per level
    const [replyText,setReplyText] = useState('');
    const [isLiked,setIsLiked] = useState(false);
    const [isDisliked,setIsDisliked] = useState(false);
  
    const commentReplies = replies[comment._id] || {
        loading: false,
        open: false,
        comments: [],
        error: null
      };
    const hasReplies = comment.replies > 0;

    // console.log(commentReplies);
    // console.log(comment);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        
        onSubmitReply(comment._id, replyText);
        setReplyText('');
        setActiveReplyId(null);
    };
    // console.log(comment);
    return (
      <div className="flex gap-4 mt-4" style={{ marginLeft: `${marginLeft}px` }}>
        <Link to={`/channel/${comment.ownerDetails._id}`}>
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={comment.ownerDetails.avatar[0]} />
            <AvatarFallback>{comment.ownerDetails.userName.charAt(0)}</AvatarFallback>
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
            {/* Like/dislike buttons... */}
            <div className="flex rounded-full bg-secondary">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-l-full gap-2 ${isLiked ? 'text-primary font-medium' : ''}`}
                    // onClick={handleLike}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    {/* <span>{formatNumber(totalLikes)}</span> */}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-r-full gap-2 ${isDisliked ? 'text-primary font-medium' : ''}`}
                    // onClick={handleDislike}
                  >
                    <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveReplyId(activeReplyId === comment._id ? null : comment._id)}
            >
              Reply
            </Button>
          </div>
  
          {/* Reply Input */}
          {activeReplyId === comment._id && (
            <div className="mt-4 flex gap-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user?.avatar[0]} />
                <AvatarFallback>{user?.userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <form 
                className="flex-1"
                onSubmit={handleReplySubmit}
              >
                <textarea
                  className="w-full resize-none border rounded-lg p-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Add a reply..."
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveReplyId(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">Reply</Button>
                </div>
              </form>
            </div>
          )}
  
          {/* Replies Section */}
          {commentReplies.open && commentReplies?.comments?.length > 0 && (
            <div className="mt-4 space-y-4">
              {commentReplies.comments.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  replies={replies}
                  onFetchReplies={onFetchReplies}
                  onSubmitReply={onSubmitReply}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
  

            {hasReplies && depth < maxDepth && (
            <div className="mt-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-muted-foreground hover:text-primary"
                    onClick={() => onFetchReplies(comment._id)}
                    disabled={commentReplies?.loading}
                >
                    {commentReplies?.loading ? (
                    <span className="flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        Loading...
                    </span>
                    ) : commentReplies?.open ? (
                    `Hide ${comment.replies} replies`
                    ) : (
                    `View ${comment.replies} replies`
                    )}
                </Button>
                {commentReplies.error && (
                    <div className="text-red-500 text-sm mt-1">{commentReplies.error}</div>
                )}
            </div>
            )}


          {/* View Replies Button */}
          {/* {!replies?.open && comment.replies>0 && depth < maxDepth && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-muted-foreground"
              onClick={onFetchReplies}
              disabled={replies?.loading}
            >
              {replies?.loading ? 'Loading...' : `View replies ${comment.replies}`}
            </Button>
          )} */}
        </div>
      </div>
    );
  };