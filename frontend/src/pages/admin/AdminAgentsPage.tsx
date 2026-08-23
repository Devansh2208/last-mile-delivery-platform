import React, { useEffect, useState } from 'react';
import { agentsApi } from '../../api/agents';
import { AgentResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { AgentTable } from '../../components/agents/AgentTable';
import { CreateAgentModal } from '../../components/agents/CreateAgentModal';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { Users, UserPlus, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

export const AdminAgentsPage: React.FC = () => {
  const { error } = useToast();
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const data = await agentsApi.getAgents();
      setAgents(data);
    } catch (err) {
      error('Failed to load agent fleet', extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const totalAgents = agents.length;
  const availableAgents = agents.filter((a) => a.active && a.available).length;
  const busyAgents = agents.filter((a) => a.active && !a.available).length;
  const inactiveAgents = agents.filter((a) => !a.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            Delivery Agent Fleet Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain driver personnel, monitor fleet availability, and dispatch assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAgents}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add New Agent
          </Button>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Fleet"
          value={isLoading ? '...' : totalAgents}
          subtitle="Registered delivery personnel"
          variant="brand"
          icon={<Users className="w-5 h-5 text-brand-600" />}
        />
        <StatCard
          title="Available for Dispatch"
          value={isLoading ? '...' : availableAgents}
          subtitle="Ready to take orders"
          variant="emerald"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Currently On Delivery"
          value={isLoading ? '...' : busyAgents}
          subtitle="Active delivery runs"
          variant="purple"
          icon={<Clock className="w-5 h-5 text-purple-600" />}
        />
        <StatCard
          title="Inactive Agents"
          value={isLoading ? '...' : inactiveAgents}
          subtitle="Deactivated or off-duty"
          variant="slate"
          icon={<Users className="w-5 h-5 text-slate-400" />}
        />
      </div>

      {/* Agents Table */}
      <AgentTable
        agents={agents}
        isLoading={isLoading}
        onRefresh={fetchAgents}
      />

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchAgents}
      />
    </div>
  );
};

