import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Star, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturedSession({ session, onStart }) {
  return (
    <Card className="bg-gradient-to-r from-violet-500 via-purple-600 to-blue-600 text-white border-0 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-24 -translate-x-24"></div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-2">
                  🌟 Featured Session
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">{session.title}</h2>
              </div>
            </div>
            
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              {session.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{session.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Guided by {session.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current text-amber-300" />
                <span>Perfect for {session.difficulty}s</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              size="lg"
              className="bg-white text-violet-700 border border-violet-500 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
              onClick={() => onStart && onStart(session)}
            >
              <Play className="w-5 h-5 mr-3" />
              Start Now
            </Button>
            <p className="text-xs text-white/70 text-center">
              Join 1,000+ users who loved this
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
