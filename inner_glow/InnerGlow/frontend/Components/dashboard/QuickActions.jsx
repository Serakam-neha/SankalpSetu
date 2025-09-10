import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Brain, Heart, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickActions() {
  const actions = [
    {
      title: "Start Meditation",
      description: "5-minute mindfulness session",
      icon: Heart,
      color: "from-emerald-500 to-teal-600",
      link: createPageUrl("Meditations")
    },
    {
      title: "Talk to AI",
      description: "Get emotional support",
      icon: Brain,
      color: "from-blue-500 to-violet-600",
      link: createPageUrl("AIChat")
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-violet-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action, index) => (
            <Link key={action.title} to={action.link}>
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4 border border-slate-200 hover:border-slate-300 bg-white transition-all duration-300 hover:shadow-md hover:bg-white/80"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mr-4`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">{action.title}</p>
                  <p className="text-sm text-slate-600">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
