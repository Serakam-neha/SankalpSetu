import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MessageSquare, Clock, Heart, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiService } from "../../src/services/api";
import { useAuth } from "../../src/contexts/AuthContext";

export default function PostCard({ post, replyCount, onPostUpdate }) {
  const { user } = useAuth();
  
  // Get user info from the populated userId field
  const authorName = post.userId?.name || 'Anonymous User';
  const authorAvatar = post.userId?.avatar?.url;
  const commentCount = post.comments?.length || 0;
  const likesCount = post.likes?.length || 0;
  
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user has liked this post
  useEffect(() => {
    if (user && post.likes) {
      const userHasLiked = post.likes.some(likeId => likeId.toString() === user._id);
      setIsLiked(userHasLiked);
    }
  }, [user, post.likes]);

  const handleLike = async () => {
    if (isSubmitting || !user) return;
    
    setIsSubmitting(true);
    try {
      const response = await apiService.request(`/community/${post._id}/like`, {
        method: 'POST'
      });
      setIsLiked(response.isLiked);
      if (onPostUpdate) {
        const updatedPost = { ...post, likes: response.isLiked ? [...(post.likes || []), user._id] : (post.likes || []).filter(id => id.toString() !== user._id) };
        onPostUpdate(updatedPost);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await apiService.request(`/community/${post._id}/comment`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment })
      });
      setNewComment('');
      if (onPostUpdate) {
        // Update the post with new comment
        onPostUpdate(response);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl hover:border-violet-200 transition-all duration-300 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-violet-700 transition-colors">
            {post.title}
          </CardTitle>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 capitalize">
            {post.category?.replace(/_/g, ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {post.content}
        </p>
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.isAnonymous ? 'Anonymous' : authorName}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isSubmitting}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-500"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{commentCount}</span>
          </Button>
        </div>
        
        {/* Comments section - only show when comment button is clicked */}
        {showComments && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            {/* Existing comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {post.comments.map((comment, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {comment.userId?.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add comment form */}
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newComment.trim() || isSubmitting}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
