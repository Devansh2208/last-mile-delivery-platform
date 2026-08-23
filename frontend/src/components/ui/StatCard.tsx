import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  variant?: 'brand' | 'emerald' | 'amber' | 'purple' | 'slate' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'brand',
  onClick,
}) => {
  const variantStyles = {
    brand: {
      bg: 'bg-brand-50/70 text-brand-600 border-brand-100',
      glow: 'hover:border-brand-300',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-600 border-emerald-100',
      glow: 'hover:border-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-600 border-amber-100',
      glow: 'hover:border-amber-300',
    },
    purple: {
      bg: 'bg-purple-50/70 text-purple-600 border-purple-100',
      glow: 'hover:border-purple-300',
    },
    slate: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      glow: 'hover:border-slate-300',
    },
    rose: {
      bg: 'bg-rose-50/70 text-rose-600 border-rose-100',
      glow: 'hover:border-rose-300',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.01]' : ''
      } ${style.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h4>
            {trend && (
              <span
                className={`text-xs font-bold ${
                  trend.positive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend.positive ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-2xl border ${style.bg} flex-shrink-0`}>{icon}</div>
      </div>
    </div>
  );
};

