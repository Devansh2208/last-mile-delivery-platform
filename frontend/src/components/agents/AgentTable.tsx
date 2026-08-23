import React from 'react';
import { AgentResponse } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { TableSkeleton } from '../ui/Skeleton';
import { Users, Phone, CheckCircle2, XCircle } from 'lucide-react';

export interface AgentTableProps {
  agents: AgentResponse[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const AgentTable: React.FC<AgentTableProps> = ({ agents, isLoading = false }) => {
  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  if (agents.length === 0) {
    return (
      <EmptyState
        title="No Delivery Agents"
        description="No delivery agents have been added to the fleet yet. Create one using the button above."
        icon={<Users className="w-8 h-8 text-slate-400" />}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Agent Name</th>
              <th className="py-3.5 px-4">Phone Number</th>
              <th className="py-3.5 px-4">Active Status</th>
              <th className="py-3.5 px-4">Fleet Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-extrabold text-xs">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{agent.name}</span>
                </td>

                <td className="py-4 px-4 font-medium text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{agent.phone}</span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  {agent.active ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      <XCircle className="w-3.5 h-3.5" />
                      Inactive
                    </span>
                  )}
                </td>

                <td className="py-4 px-4">
                  {agent.available ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      Available for Assignment
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      On Delivery / Busy
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

