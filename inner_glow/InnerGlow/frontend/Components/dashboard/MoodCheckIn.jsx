import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Heart, Star } from "lucide-react";

const emotions = [
  "happy", "sad", "anxious", "calm", "excited", "frustrated", 
  "grateful", "lonely", "confident", "overwhelmed", "peaceful", "angry"
];

const activities = [
  "work", "exercise", "social", "family", "rest", "creative",
  "outdoor", "learning", "meditation", "music", "reading", "cooking"
];

export default function MoodCheckIn({ onSubmit, onCancel }) {
  const [moodRating, setMoodRating] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [stressLevel, setStressLevel] = useState(3);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      mood_rating: moodRating,
      emotions: selectedEmotions,
      activities: selectedActivities,
      stress_level: stressLevel,
      notes: notes.trim()
    });
  };

  const toggleEmotion = (emotion) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Daily Check-in
                </CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mood Rating */}
              <div>
                <label className="text-lg font-semibold text-slate-800 mb-4 block">
                  How are you feeling today? (1-10)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setMoodRating(rating)}
                      className={`w-10 h-10 rounded-full border-2 font-semibold transition-all duration-200 ${
                        rating <= moodRating
                          ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-500'
                          : 'border-slate-300 text-slate-500 hover:border-violet-300'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  Current rating: <span className="font-medium">{moodRating}/10</span>
                </p>
              </div>

              {/* Emotions */}
              <div>
                <label className="text-lg font-semibold text-slate-800 mb-4 block">
                  What emotions are you experiencing?
                </label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <Badge
                      key={emotion}
                      variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedEmotions.includes(emotion)
                          ? 'bg-violet-500 hover:bg-violet-600'
                          : 'hover:bg-violet-50 hover:border-violet-300'
                      }`}
                      onClick={() => toggleEmotion(emotion)}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stress Level */}
              <div>
                <label className="text-lg font-semibold text-slate-800 mb-4 block">
                  Stress Level (1-5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setStressLevel(level)}
                      className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                        level <= stressLevel
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-400'
                          : 'border-slate-300 text-slate-500 hover:border-amber-300'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div>
                <label className="text-lg font-semibold text-slate-800 mb-4 block">
                  What activities influenced your mood today?
                </label>
                <div className="flex flex-wrap gap-2">
                  {activities.map((activity) => (
                    <Badge
                      key={activity}
                      variant={selectedActivities.includes(activity) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedActivities.includes(activity)
                          ? 'bg-emerald-500 hover:bg-emerald-600'
                          : 'hover:bg-emerald-50 hover:border-emerald-300'
                      }`}
                      onClick={() => toggleActivity(activity)}
                    >
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-lg font-semibold text-slate-800 mb-4 block">
                  Additional thoughts (optional)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share anything else about how you're feeling today..."
                  className="h-24 resize-none border-slate-300 focus:border-violet-400 focus:ring-violet-400"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-slate-300 text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  Save Check-in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
