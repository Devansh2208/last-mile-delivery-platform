import React from 'react';
import { OrderStatus } from '../../types';
import { STATUS_CONFIG } from '../../utils/status';

export interface BadgeProps {
  status?: OrderStatus;
  variant?: 'slate' | 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'indigo';
  children?: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  size = 'md',
  dot = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  if (status) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.CREATED;
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
      >
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
        <span>{children || config.label}</span>
      </span>
    );
  }

  const variantStyles = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const selectedVariant = variant ? variantStyles[variant] : variantStyles.slate;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${selectedVariant} ${sizeClasses[size]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      <span>{children}</span>
    </span>
  );
};

