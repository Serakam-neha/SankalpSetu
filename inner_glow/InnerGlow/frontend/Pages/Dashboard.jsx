import React, { useState, useEffect } from "react";
import { MoodEntry } from "@/entities/MoodEntry";
import { MeditationSession } from "@/entities/MeditationSession";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Heart, 
  Brain, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Plus,
  Target,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, isToday } from "date-fns";

import MoodCheckIn from "../Components/dashboard/MoodCheckIn";
import WellnessInsights from "../Components/dashboard/WellnessInsights";
import QuickActions from "../Components/dashboard/QuickActions";
import RecentActivity from "../Components/dashboard/RecentActivity";
import ConnectionTest from "../src/components/ConnectionTest";
import { useAuth } from "../src/contexts/AuthContext.jsx";

export default function Dashboard() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const entries = await MoodEntry.list("-created_date", 30);
      setMoodEntries(entries);
      
      const today = entries.find(entry => isToday(new Date(entry.created_date)));
      setTodayMood(today);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSubmit = async (moodData) => {
    try {
      await MoodEntry.create(moodData);
      setShowMoodCheck(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }
  };

  const getWellnessStreak = () => {
    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const checkDate = subDays(new Date(), i);
      const hasEntry = moodEntries.some(entry => 
        format(new Date(entry.created_date), 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd')
      );
      if (hasEntry) streak++;
      else break;
    }
    return streak;
  };

  const averageMood = moodEntries.length > 0 
    ? (moodEntries.reduce((sum, entry) => sum + entry.mood_rating, 0) / moodEntries.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                         <div>
               <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                 Welcome Back{user ? `, ${user.name || user.email?.split('@')[0] || 'User'}` : ''}
               </h1>
               <p className="text-slate-600 text-lg">
                 {isToday(new Date()) && todayMood 
                   ? "You've checked in today. How are you feeling now?" 
                   : "Let's start your wellness journey for today"
                 }
               </p>
             </div>
            
            <div className="flex gap-3">
              {!todayMood && (
                <Button 
                  onClick={() => setShowMoodCheck(true)}
                  className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Daily Check-in
                </Button>
              )}
              
              <Link to={createPageUrl("AIChat")}>
                <Button 
                  variant="outline" 
                  className="border-2 border-violet-200 text-violet-700 hover:bg-violet-50 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:border-violet-300"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Talk to AI
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 ">
                <div className="flex items-center justify-between ">
                  <CardTitle className="text-lg font-medium text-white">Wellness Streak</CardTitle>
                  <Target className="w-6 h-6 opacity-80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{getWellnessStreak()}</div>
                <p className="text-violet-100 text-sm">days in a row</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-white">Average Mood</CardTitle>
                  <Heart className="w-6 h-6 opacity-80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{averageMood}/10</div>
                <p className="text-emerald-100 text-sm">past 30 days</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-white">Check-ins</CardTitle>
                  <Activity className="w-6 h-6 opacity-80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{moodEntries.length}</div>
                <p className="text-blue-100 text-sm">total entries</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-white">Today's Mood</CardTitle>
                  <Sparkles className="w-6 h-6 opacity-80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {todayMood ? `${todayMood.mood_rating}/10` : '--'}
                </div>
                <p className="text-amber-100 text-sm">
                  {todayMood ? 'logged today' : 'not yet logged'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <WellnessInsights moodEntries={moodEntries} />
            <RecentActivity moodEntries={moodEntries} />
          </div>
          
          <div className="space-y-8">
            <QuickActions />
            <ConnectionTest />
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-violet-600" />
                    Today's Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                                     <div className="p-4 bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-100">
                     <h4 className="font-semibold text-slate-800 mb-2">Mindful Moment</h4>
                     <p className="text-sm text-slate-600 leading-relaxed">
                       Take three deep breaths and notice how your body feels right now. 
                       This simple practice can help center your mind and reduce stress.
                     </p>
                   </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    💚 Self-Care Reminder
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
              
        {showMoodCheck && (
          <MoodCheckIn 
            onSubmit={handleMoodSubmit}
            onCancel={() => setShowMoodCheck(false)}
          />
        )}
      </div>
    </div>
  );
}
