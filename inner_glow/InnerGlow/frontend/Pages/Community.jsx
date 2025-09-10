import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostForm from "../Components/community/PostForm";
import PostCard from "../Components/community/PostCard";
import ReplyThread from "../Components/community/ReplyThread";
import { apiService } from "../src/services/api";


export default function Community() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getCommunityPosts();
      const allPosts = response.posts || [];
      
      // Since our backend doesn't use parent_id, we'll treat all posts as main posts
      // and comments as replies within each post
      setPosts(allPosts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading community data:', error);
      setPosts([]);
      setIsLoading(false);
    }
  };

  const handlePostSubmit = async (postData) => {
    try {
      const newPost = await apiService.createCommunityPost(postData);
      setShowForm(false);
      // Add the new post to the beginning of the posts array
      setPosts(prevPosts => [newPost, ...prevPosts]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  
  const handleReplySubmit = async (updatedPost) => {
    try {
      // Update the specific post in state
      updatePostInState(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  const updatePostInState = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
    
    // Also update selected post if it's the same one
    if (selectedPost && selectedPost._id === updatedPost._id) {
      setSelectedPost(updatedPost);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Community Forum
                </h1>
                <p className="text-slate-600 text-lg">
                  Connect, share, and find support anonymously.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Post
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse h-48 bg-slate-100"></Card>
                ))
              ) : posts.length > 0 ? (
                posts.map((post, index) => (
                  <motion.div 
                    key={post._id || post.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <PostCard post={post} replyCount={post.comments?.length || 0} onPostUpdate={updatePostInState} />
                  </motion.div>
                ))
              ) : (
                <Card className="text-center p-12 bg-white/70">
                  <MessageSquare className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700">No posts yet</h3>
                  <p className="text-slate-500">Be the first to start a conversation!</p>
                </Card>
              )}
            </AnimatePresence>
          </div>
          
          <div className="lg:sticky top-8">
            {selectedPost ? (
              <ReplyThread 
                post={selectedPost} 
                replies={selectedPost.comments || []}
                onReplySubmit={handleReplySubmit}
                onClose={() => setSelectedPost(null)}
              />
            ) : (
               <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl p-8 text-center">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700">View Conversation</h3>
                  <p className="text-slate-500 mt-2">Select a post on the left to see the full thread and join the discussion.</p>
               </Card>
            )}
          </div>
        </div>

        {showForm && (
          <PostForm 
            onSubmit={handlePostSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
}
