import React from 'react';
import { OrderStatus, TrackingResponse } from '../../types';
import { STANDARD_TIMELINE_STEPS, STATUS_CONFIG } from '../../utils/status';
import { formatDate } from '../../utils/formatters';
import { CheckCircle2, Clock, MapPin, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

export interface TrackingTimelineProps {
  currentStatus: OrderStatus;
  events: TrackingResponse[];
  isLoading?: boolean;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  currentStatus,
  events,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const isTerminalStatus = ['FAILED', 'RESCHEDULED', 'CANCELLED'].includes(currentStatus);
  const currentStepIndex = STANDARD_TIMELINE_STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* 1. Progress Step Bar (Desktop) */}
      <div className="hidden sm:block p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex items-center justify-between">
          {/* Connector line background */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-100 -z-0" />

          {/* Active connector line */}
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-500 -z-0"
            style={{
              width:
                currentStepIndex >= 0
                  ? `${(currentStepIndex / (STANDARD_TIMELINE_STEPS.length - 1)) * 100}%`
                  : '0%',
            }}
          />

          {STANDARD_TIMELINE_STEPS.map((step, index) => {
            const isCompleted = currentStepIndex > index;
            const isCurrent = currentStepIndex === index;
            const stepConfig = STATUS_CONFIG[step];

            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                      : isCurrent
                      ? 'bg-brand-500 text-white ring-4 ring-brand-100 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 whitespace-nowrap ${
                    isCurrent
                      ? 'text-brand-700 font-bold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {stepConfig.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal or Special Alert if failed/cancelled */}
      {isTerminalStatus && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            currentStatus === 'CANCELLED'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : currentStatus === 'FAILED'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          {currentStatus === 'CANCELLED' ? (
            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          ) : currentStatus === 'FAILED' ? (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <RefreshCw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-bold text-sm">Delivery Status: {STATUS_CONFIG[currentStatus].label}</h4>
            <p className="text-xs mt-0.5 opacity-90">{STATUS_CONFIG[currentStatus].description}</p>
          </div>
        </div>
      )}

      {/* 2. Detailed Tracking Event Log Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          Tracking Event History ({events.length})
        </h4>

        {events.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No tracking status updates have been recorded yet.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {events.map((event, index) => {
              const isLatest = index === events.length - 1;
              const config = STATUS_CONFIG[event.status as OrderStatus] || {
                label: event.status,
                bg: 'bg-slate-100',
                text: 'text-slate-700',
                border: 'border-slate-300',
                dot: 'bg-slate-400',
              };

              return (
                <div key={event.id || index} className="relative group">
                  {/* Timeline node icon */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-all ${
                      isLatest ? `${config.dot} ring-4 ring-brand-100` : 'bg-slate-300'
                    }`}
                  />

                  <div className="bg-slate-50/70 group-hover:bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 transition-colors">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border ${config.bg} ${config.text} ${config.border}`}
                      >
                        {config.label}
                      </span>
                      {event.created_at && (
                        <span className="text-[11px] font-medium text-slate-400">
                          {formatDate(event.created_at)}
                        </span>
                      )}
                    </div>

                    {event.location && (
                      <div className="text-xs text-slate-700 flex items-center gap-1.5 mt-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                        <span>Location: {event.location}</span>
                      </div>
                    )}

                    {event.description && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

