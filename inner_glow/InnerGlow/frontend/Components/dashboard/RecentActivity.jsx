import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";

export default function RecentActivity({ moodEntries }) {
  const getDateLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  const getMoodColor = (rating) => {
    if (rating >= 8) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (rating >= 6) return "bg-blue-100 text-blue-800 border-blue-200";
    if (rating >= 4) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Activity className="w-7 h-7 text-violet-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {moodEntries.length > 0 ? (
            <div className="space-y-4">
              {moodEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">
                        {getDateLabel(new Date(entry.created_date))}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`border ${getMoodColor(entry.mood_rating)}`}
                    >
                      Mood: {entry.mood_rating}/10
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {entry.emotions?.slice(0, 3).map((emotion) => (
                      <Badge 
                        key={emotion} 
                        variant="secondary" 
                        className="text-xs bg-violet-100 text-violet-700"
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No mood entries yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Start tracking your wellness journey today
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
