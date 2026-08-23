import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}> = ({ size = 'md', className = '', label }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin text-brand-600 ${sizeStyles[size]}`} />
      {label && <p className="text-xs text-slate-500 font-medium">{label}</p>}
    </div>
  );
};

