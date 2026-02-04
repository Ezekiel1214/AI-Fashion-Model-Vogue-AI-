import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', isLoading?: boolean }> = ({ 
  children, variant = 'primary', className = '', isLoading, disabled, ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-stone-100 text-stone-900 hover:bg-white border border-transparent shadow-sm",
    secondary: "bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700",
    outline: "bg-transparent text-stone-300 border border-stone-600 hover:border-stone-400",
    ghost: "bg-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-800/50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 ml-1">
    {children}
  </label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    className="w-full bg-stone-900/50 border border-stone-800 text-stone-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 placeholder-stone-600 text-sm transition-colors"
    {...props}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <div className="relative">
    <select 
      className="w-full appearance-none bg-stone-900/50 border border-stone-800 text-stone-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm transition-colors cursor-pointer"
      {...props}
    />
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-500">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-stone-900 border border-stone-800 rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);
