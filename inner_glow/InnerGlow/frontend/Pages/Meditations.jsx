import React, { useState, useEffect } from "react";
import { MeditationSession } from "@/entities/MeditationSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Clock,
  Search, 
  Filter,
  Play,
  Star,
  Moon,
  Focus,
  Wind,
  Brain
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

import MeditationCard from "../Components/meditations/MeditationCard";
import CategoryFilter from "../Components/meditations/CategoryFilter";
import FeaturedSession from "../Components/meditations/FeaturedSession";

export default function Meditations() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { id: "all", label: "All", icon: Heart, color: "bg-slate-500" },
    { id: "stress_relief", label: "Stress Relief", icon: Wind, color: "bg-blue-500" },
    { id: "sleep", label: "Sleep", icon: Moon, color: "bg-indigo-500" },
    { id: "anxiety", label: "Anxiety", icon: Heart, color: "bg-emerald-500" },
    { id: "focus", label: "Focus", icon: Focus, color: "bg-amber-500" },
    { id: "mindfulness", label: "Mindfulness", icon: Brain, color: "bg-purple-500" },
    { id: "breathing", label: "Breathing", icon: Wind, color: "bg-cyan-500" },
  ];

  useEffect(() => {
    loadMeditations();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchQuery, selectedCategory]);

  const loadMeditations = async () => {
    setIsLoading(true);
    const data = await MeditationSession.list();
    setSessions(data);
    setIsLoading(false);
  };

  const filterSessions = () => {
    let filtered = sessions;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(session => session.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
  };

  const handleStart = (session) => {
    // Navigate to the meditation player page
    navigate(`/meditations/${session.id}`);
  };

  const featuredSession = {
    id: "123",
    title: "Morning Calm",
    description: "Start your day with peace.",
    duration: 10,
    instructor: "Jane Doe",
    difficulty: "Beginner"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                Guided Meditations
              </h1>
              <p className="text-slate-600 text-lg">
                Find inner peace with our curated collection of mindfulness sessions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Featured Session */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <FeaturedSession session={featuredSession} onStart={handleStart} />
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search meditations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-slate-300 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-slate-500" />
                  <CategoryFilter 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 bg-white/70 backdrop-blur-sm border border-slate-200">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <category.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Meditations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-slate-200 rounded mb-4"></div>
                    <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session, index) => (
                <MeditationCard
                  key={session.id || index}
                  session={session}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-lg">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  No meditations found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
