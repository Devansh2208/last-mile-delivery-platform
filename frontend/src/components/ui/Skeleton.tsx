import React from 'react';

export const Skeleton: React.FC<{
  className?: string;
  count?: number;
}> = ({ className = 'h-4 w-full', count = 1 }) => {
  if (count === 1) {
    return <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
  }

  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-4 p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 flex-1 animate-pulse bg-slate-200 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-4 border-b border-slate-100">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-4 flex-1 animate-pulse bg-slate-100 rounded"
              style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

