
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, MessageCircle, Brain, User, BarChart3, Sparkles, Users, LogOut } from "lucide-react";
import { useAuth } from "./src/contexts/AuthContext.jsx";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const getNavigationItems = (user, logout) => {
  const baseItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: BarChart3,
      color: "text-violet-600"
    },
    {
      title: "AI Assistant",
      url: createPageUrl("AIChat"),
      icon: Brain,
      color: "text-blue-600"
    },
    {
      title: "Meditations",
      url: createPageUrl("Meditations"),
      icon: Heart,
      color: "text-emerald-600"
    },
    {
      title: "Community",
      url: createPageUrl("Community"),
      icon: Users,
      color: "text-amber-600"
    }
  ];

  if (user) {
    // User is logged in, show logout option
    baseItems.push({
      title: "Logout",
      url: "#",
      icon: LogOut,
      color: "text-red-600",
      onClick: logout
    });
  } else {
    // User is not logged in, show login option
    baseItems.push({
      title: "Login",
      url: createPageUrl("Login"),
      icon: User,
      color: "text-cyan-600"
    });
  }

  return baseItems;
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --wellness-primary: #8B5FBF;
          --wellness-secondary: #6B73FF;
          --wellness-accent: #50C878;
          --wellness-bg: #FDFBFF;
          --wellness-surface: #FFFFFF;
          --wellness-text: #2D3748;
          --wellness-text-light: #718096;
        }
        
        body {
          background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .wellness-gradient {
          background: linear-gradient(135deg, var(--wellness-primary), var(--wellness-secondary));
        }
        
        .wellness-glow {
          box-shadow: 0 4px 20px rgba(139, 95, 191, 0.15);
        }
        
        .breathe-animation {
          animation: breathe 4s ease-in-out infinite;
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
      <div className="min-h-screen flex w-full">
        <Sidebar className={`border-r border-slate-200 bg-gradient-to-b from-white to-slate-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative fixed inset-y-0 left-0 z-50 w-80`}>
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 wellness-gradient rounded-2xl flex items-center justify-center wellness-glow breathe-animation">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  InnerGlow 
                </h2>
                <p className="text-xs text-slate-500 font-medium">Your Wellness Companion</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3">
                Wellness Journey
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {getNavigationItems(user, logout).map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild={!item.onClick}
                        onClick={item.onClick}
                        className={`group rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md ${
                          location.pathname === item.url 
                            ? 'bg-white shadow-md border border-slate-100' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        {item.onClick ? (
                          <button className="flex items-center gap-4 px-4 py-3 w-full text-left">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                              'from-slate-50 to-slate-100'
                            } flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                              <item.icon className={`w-5 h-5 ${
                                'text-slate-500'
                              }`} />
                            </div>
                            <span className={`font-semibold ${
                              'text-slate-600'
                            }`}>
                              {item.title}
                            </span>
                          </button>
                        ) : (
                          <Link to={item.url} className="flex items-center gap-4 px-4 py-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                              location.pathname === item.url 
                                ? 'from-violet-100 to-blue-100' 
                                : 'from-slate-50 to-slate-100'
                            } flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                              <item.icon className={`w-5 h-5 ${
                                location.pathname === item.url 
                                  ? item.color 
                                  : 'text-slate-500'
                              }`} />
                            </div>
                            <span className={`font-semibold ${
                              location.pathname === item.url 
                                ? 'text-slate-800' 
                                : 'text-slate-600'
                            }`}>
                              {item.title}
                            </span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-8 p-4 bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl border border-violet-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-700 text-sm">Daily Wellness</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a moment for yourself today. Remember, small steps lead to big changes in your mental wellness journey.
              </p>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">
                  {user ? user.name || user.email : 'Welcome'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user ? 'Signed in' : 'Your wellness matters'}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 md:ml-0">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200"
              >
                ☰
              </button>
              <h1 className="text-xl font-bold text-slate-800">MindfulAI</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
        
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
}

