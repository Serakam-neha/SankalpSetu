import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

export default function WellnessInsights({ moodEntries }) {
  const getWeeklyAverage = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    
    const weekEntries = moodEntries.filter(entry => {
      const entryDate = new Date(entry.created_date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    return weekEntries.length > 0 
      ? (weekEntries.reduce((sum, entry) => sum + entry.mood_rating, 0) / weekEntries.length).toFixed(1)
      : 0;
  };

  const getMoodTrend = () => {
    if (moodEntries.length < 2) return "stable";
    
    const recent = moodEntries.slice(0, 3);
    const older = moodEntries.slice(3, 6);
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood_rating, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.mood_rating, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return "improving";
    if (recentAvg < olderAvg - 0.5) return "declining";
    return "stable";
  };

  const getTopEmotions = () => {
    const emotionCounts = {};
    moodEntries.forEach(entry => {
      entry.emotions?.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([emotion, count]) => ({ emotion, count }));
  };

  const trend = getMoodTrend();
  const topEmotions = getTopEmotions();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BarChart className="w-7 h-7 text-violet-600" />
            Wellness Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-violet-600" />
                <span className="font-semibold text-slate-700">This Week</span>
              </div>
              <p className="text-2xl font-bold text-violet-700">{getWeeklyAverage()}/10</p>
              <p className="text-sm text-slate-600">Average mood</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-700">Trend</span>
              </div>
              <p className="text-2xl font-bold text-blue-700 capitalize">{trend}</p>
              <p className="text-sm text-slate-600">Recent pattern</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">💚</span>
                <span className="font-semibold text-slate-700">Top Emotion</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700 capitalize">
                {topEmotions[0]?.emotion || 'None'}
              </p>
              <p className="text-sm text-slate-600">
                {topEmotions[0]?.count || 0} times
              </p>
            </div>
          </div>

          {topEmotions.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Your Most Common Emotions</h4>
              <div className="space-y-2">
                {topEmotions.map(({ emotion, count }) => (
                  <div key={emotion} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700 capitalize">{emotion}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-violet-400 to-purple-500 h-2 rounded-full"
                          style={{ width: `${(count / Math.max(...topEmotions.map(e => e.count))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-500">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
