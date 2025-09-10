import React from 'react';

export function Select({ children, value, onValueChange, ...props }) {
  return (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, className = "", ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children }) {
  return <div>{children}</div>;
}

export function SelectItem({ children, value }) {
  return <option value={value}>{children}</option>;
} 