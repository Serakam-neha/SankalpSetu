import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Moon, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function SuggestedPrompts({ onSelectPrompt }) {
  const prompts = [
    {
      text: "I'm feeling anxious about work",
      icon: Brain,
      color: "from-blue-400 to-blue-600"
    },
    {
      text: "Help me practice gratitude",
      icon: Heart,
      color: "from-emerald-400 to-emerald-600"
    },
    {
      text: "I'm having trouble sleeping",
      icon: Moon,
      color: "from-indigo-400 to-indigo-600"
    },
    {
      text: "I need motivation today",
      icon: Zap,
      color: "from-amber-400 to-amber-600"
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600 font-medium">Try asking about:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
        {prompts.map((prompt, index) => (
          <motion.div
            key={prompt.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              onClick={() => onSelectPrompt(prompt.text)}
              className="w-full justify-start h-auto p-4 text-left border border-slate-200 hover:border-slate-300 hover:bg-gradient-to-br transition-all duration-200 bg-white"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${prompt.color} flex items-center justify-center mr-3 `}>
                <prompt.icon className="w-4 h-4 text-white"/>
              </div>
              <span className="text-sm text-slate-700 ">{prompt.text}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
