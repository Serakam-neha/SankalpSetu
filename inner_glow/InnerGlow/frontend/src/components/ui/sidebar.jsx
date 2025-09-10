import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children, className = "" }) {
  return <aside className={className}>{children}</aside>;
}

export function SidebarHeader({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function SidebarContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function SidebarFooter({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function SidebarGroup({ children }) {
  return <div>{children}</div>;
}

export function SidebarGroupLabel({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function SidebarGroupContent({ children }) {
  return <div>{children}</div>;
}

export function SidebarMenu({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function SidebarMenuItem({ children }) {
  return <div>{children}</div>;
}

export function SidebarMenuButton({ children, asChild, className = "", ...props }) {
  if (asChild) {
    return React.cloneElement(children, { className, ...props });
  }
  return <button className={className} {...props}>{children}</button>;
}

export function SidebarTrigger({ className = "", ...props }) {
  return <button className={className} {...props}>☰</button>;
} 