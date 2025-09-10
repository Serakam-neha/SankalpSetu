import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/entities/ChatMessage";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Send, 
  Sparkles, 
  Heart, 
  MessageCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import ChatMessageItem from "../Components/chat/ChatMessageItem";
import SuggestedPrompts from "../Components/chat/SuggestedPrompts";
import TypingIndicator from "../Components/chat/TypingIndicator";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    // Add welcome message
    setTimeout(() => {
      setMessages([{
        id: 'welcome',
        content: "Hello! I'm your AI wellness companion. I'm here to listen, support, and provide guidance for your mental health journey. How are you feeling today?",
        sender: 'ai',
        created_date: new Date().toISOString()
      }]);
    }, 500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    const history = await ChatMessage.filter({ session_id: sessionId }, "-created_date");
    setMessages(history);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      content: messageText,
      sender: 'user',
      session_id: sessionId,
      created_date: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Save user message
      await ChatMessage.create(userMessage);

      // Get AI response
      const response = await InvokeLLM({
        prompt: `You are a compassionate AI mental health companion. The user said: "${messageText}". 
        
        Please provide supportive, empathetic, and helpful guidance. Keep responses warm, professional, and focused on mental wellness. 
        Ask follow-up questions when appropriate. Avoid giving medical advice but offer emotional support and coping strategies.
        
        If the user seems to be in crisis, gently suggest they reach out to a mental health professional or crisis hotline.
        
        Keep responses concise but meaningful, around 2-3 sentences unless more detail would be helpful.`,
      });

      const aiMessage = {
        content: response,
        sender: 'ai',
        session_id: sessionId,
        created_date: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      await ChatMessage.create(aiMessage);

    } catch (error) {
      const errorMessage = {
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment. Remember, if you need immediate support, consider reaching out to a mental health professional.",
        sender: 'ai',
        session_id: sessionId,
        created_date: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    setMessages([]);
    setTimeout(() => {
      setMessages([{
        id: 'welcome-new',
        content: "Hi again! I'm ready for a fresh conversation. What's on your mind today?",
        sender: 'ai',
        created_date: new Date().toISOString()
      }]);
    }, 300);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  AI Wellness Assistant
                </h1>
                <p className="text-slate-600">Your compassionate mental health companion</p>
              </div>
            </div>
            
            <Button 
              onClick={clearChat}
              variant="outline"
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </motion.div>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl">
          <CardHeader className="border-b border-slate-100 bg-white/50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-600">AI Assistant Online</span>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Heart className="w-3 h-3 mr-1" />
                  Mental Health Support
                </Badge>
              </div>
              <MessageCircle className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <ChatMessageItem 
                      key={message.id || index} 
                      message={message}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
                
                {isLoading && <TypingIndicator />}
              </div>
            </ScrollArea>

            {/* Suggested Prompts */}
            {messages.length <= 1 && !isLoading && (
              <div className="p-6 pt-0">
                <SuggestedPrompts onSelectPrompt={sendMessage} />
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 pt-4 border-t border-slate-100 bg-white/50">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    className="pr-4 py-3 text-base bg-white border-slate-300 focus:border-blue-400 focus:ring-blue-400 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-slate-500 mt-3 text-center">
                💙 This AI provides emotional support but is not a replacement for professional therapy or crisis intervention
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
