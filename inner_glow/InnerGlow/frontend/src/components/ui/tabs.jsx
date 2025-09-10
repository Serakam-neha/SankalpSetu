import React, { useState } from 'react';

export function Tabs({ children, defaultValue, value, onValueChange, ...props }) {
  const [activeTab, setActiveTab] = useState(defaultValue || value);
  
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) onValueChange(newValue);
  };
  
  return (
    <div {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            activeTab, 
            onTabChange: handleTabChange 
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className = "", ...props }) {
  return (
    <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, activeTab, onTabChange, className = "", ...props }) {
  const isActive = activeTab === value;
  
  return (
    <button
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900'
      } ${className}`}
      onClick={() => onTabChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, activeTab, className = "", ...props }) {
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
} 