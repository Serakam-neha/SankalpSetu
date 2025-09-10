import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Star, User } from "lucide-react";
import { motion } from "framer-motion";

export default function MeditationCard({ session, index }) {
  const categoryColors = {
    stress_relief: "bg-blue-100 text-blue-800",
    sleep: "bg-indigo-100 text-indigo-800",
    anxiety: "bg-emerald-100 text-emerald-800",
    focus: "bg-amber-100 text-amber-800",
    mindfulness: "bg-purple-100 text-purple-800",
    breathing: "bg-cyan-100 text-cyan-800",
    body_scan: "bg-pink-100 text-pink-800",
    loving_kindness: "bg-rose-100 text-rose-800"
  };

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-violet-700 transition-colors">
                {session.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="secondary" 
                  className={categoryColors[session.category] || "bg-slate-100 text-slate-800"}
                >
                  {session.category?.replace(/_/g, ' ')}
                </Badge>
                {session.difficulty && (
                  <Badge 
                    variant="outline" 
                    className={difficultyColors[session.difficulty]}
                  >
                    {session.difficulty}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
            {session.description || "A peaceful meditation session designed to help you find inner calm and balance."}
          </p>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{session.duration} min</span>
            </div>
            {session.instructor && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{session.instructor}</span>
              </div>
            )}
          </div>

          <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Play className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
