import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-violet-600">
        <Brain className="w-5 h-5 text-white" />
      </div>
      
      <div className="flex-1 max-w-[80%]">
        <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">AI is thinking</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-violet-400 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
