import React, { useMemo, useState } from 'react';
import { UserCheck } from 'lucide-react';
import { agentsApi } from '../../api/agents';
import { extractErrorMessage } from '../../api/client';
import { AgentResponse, OrderResponse } from '../../types';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface AssignOrderModalProps {
  order: OrderResponse | null;
  availableAgents: AgentResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

export const AssignOrderModal: React.FC<AssignOrderModalProps> = ({
  order,
  availableAgents,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignableAgents = useMemo(
    () => availableAgents.filter((agent) => agent.active && agent.available),
    [availableAgents]
  );

  const handleAssign = async () => {
    if (!order) return;

    setIsSubmitting(true);
    try {
      const result = await agentsApi.assignOrder(order.tracking_number);
      success('Order Assigned', `${result.tracking_number} assigned to ${result.agent_name}.`);
      onClose();
      await onSuccess?.();
    } catch (err) {
      error('Assignment Failed', extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => undefined : onClose}
      title="Assign Delivery Agent"
      subtitle={order ? `Dispatch order ${order.tracking_number}` : 'Select an order to assign.'}
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase text-slate-400">Auto Assignment</p>
          <p className="mt-1 text-sm text-slate-700">
            The backend will assign the first active and available agent in the fleet.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-slate-400 mb-2">
            Available Agents ({assignableAgents.length})
          </p>
          {assignableAgents.length > 0 ? (
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200">
              {assignableAgents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{agent.name}</p>
                    <p className="text-xs text-slate-500">{agent.phone}</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 rounded-xl border border-amber-200 bg-amber-50 p-3">
              No active available agents right now.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleAssign}
            isLoading={isSubmitting}
            disabled={!order || assignableAgents.length === 0}
            leftIcon={<UserCheck className="w-4 h-4" />}
          >
            Assign Agent
          </Button>
        </div>
      </div>
    </Modal>
  );
};
