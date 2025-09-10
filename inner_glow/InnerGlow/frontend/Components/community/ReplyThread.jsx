import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiService } from "../../src/services/api";

const ReplyCard = ({ reply }) => {
  const authorName = reply.userId?.name || 'Anonymous';
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">{authorName}</span>
        <span className="text-xs text-slate-500">
          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
        </span>
      </div>
      <p className="text-sm text-slate-700">{reply.content}</p>
    </div>
  );
};

export default function ReplyThread({ post, replies, onReplySubmit, onClose }) {
  const [newReply, setNewReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await apiService.request(`/community/${post._id}/comment`, {
        method: 'POST',
        body: JSON.stringify({ content: newReply })
      });
      setNewReply('');
      if (onReplySubmit) {
        // Pass the updated post data
        onReplySubmit(response);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl flex flex-col h-[80vh]">
      <CardHeader className="border-b border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">{post.title}</CardTitle>
            <p className="text-sm text-slate-600 line-clamp-2 mt-1">{post.content}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-3">
          {replies && replies.length > 0 ? (
            replies.map((reply, index) => <ReplyCard key={index} reply={reply} />)
          ) : (
            <p className="text-center text-sm text-slate-500 py-8">
              No replies yet. Be the first to share your thoughts!
            </p>
          )}
        </CardContent>
      </ScrollArea>
      
      <div className="p-4 border-t border-slate-100 bg-white/50">
        <form onSubmit={handleReplySubmit} className="space-y-3">
          <div>
            <Textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[80px] resize-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newReply.trim() || isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
