import React from "react";
import { motion } from "framer-motion";
import { Brain, User } from "lucide-react";
import { format } from "date-fns";

export default function ChatMessageItem({ message, index }) {
  const isAI = message.sender === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex gap-4 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAI 
          ? 'bg-gradient-to-br from-blue-500 to-violet-600' 
          : 'bg-gradient-to-br from-emerald-500 to-teal-600'
      }`}>
        {isAI ? (
          <Brain className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      <div className={`flex-1 max-w-[80%] ${isAI ? '' : 'flex flex-col items-end'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isAI 
            ? 'bg-white border border-slate-200 shadow-sm' 
            : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
        }`}>
          <p className={`text-sm leading-relaxed ${
            isAI ? 'text-slate-800' : 'text-white'
          }`}>
            {message.content}
          </p>
        </div>
        
        <p className={`text-xs text-slate-500 mt-1 px-2 ${
          isAI ? '' : 'text-right'
        }`}>
          {format(new Date(message.created_date), 'h:mm a')}
        </p>
      </div>
    </motion.div>
  );
}
