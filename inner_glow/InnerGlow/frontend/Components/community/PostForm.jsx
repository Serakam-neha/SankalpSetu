import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Users } from "lucide-react";

const categories = ["general", "anxiety", "stress", "relationships", "wellness", "support", "meditation", "mindfulness"];

export default function PostForm({ onSubmit, onCancel, parentId = null, title = "Create New Post" }) {
  const [postTitle, setPostTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parentId && !content.trim()) return;
    if (!parentId && (!content.trim() || !postTitle.trim())) return;

    const postData = {
      title: parentId ? `Re: ${title}` : postTitle,
      content,
      category,
      isAnonymous: false
    };
    onSubmit(postData);
    
    // Reset form for replies
    if (parentId) {
      setContent("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${parentId ? 'relative' : ''}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-w-2xl w-full"
      >
        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {title}
                </CardTitle>
              </div>
              {!parentId && (
                <Button variant="ghost" size="icon" onClick={onCancel}>
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!parentId && (
                <>
                  <div>
                    <Label htmlFor="title" className="font-semibold">Title / Question</Label>
                    <Input id="title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="What's your question or topic?" />
                  </div>
                  <div>
                    <Label htmlFor="category" className="font-semibold">Category</Label>
                     <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="content" className="font-semibold">{parentId ? "Your Reply" : "Details"}</Label>
                <Textarea 
                  id="content" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={parentId ? "Share your thoughts..." : "Provide more details here..."} 
                  className="h-28" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                 {!parentId && (
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                 )}
                <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  {parentId ? "Post Reply" : "Submit Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
