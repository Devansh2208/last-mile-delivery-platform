import React, { useState } from 'react';
import { OrderResponse, OrderStatus, TrackingCreate } from '../../types';
import { trackingApi } from '../../api/tracking';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { getAllowedNextStatuses, STATUS_CONFIG } from '../../utils/status';
import { Truck } from 'lucide-react';

export interface UpdateStatusModalProps {
  order: OrderResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [status, setStatus] = useState<OrderStatus>('PICKED_UP');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // When order changes or modal opens, initialize allowed status
  React.useEffect(() => {
    if (order) {
      const allowed = getAllowedNextStatuses(order.status);
      if (allowed.length > 0) {
        setStatus(allowed[0]);
      } else {
        setStatus('DELIVERED');
      }
      setLocation('');
      setDescription('');
    }
  }, [order, isOpen]);

  if (!order) return null;

  const allowedStatuses = getAllowedNextStatuses(order.status);
  const statusOptions = (allowedStatuses.length > 0 ? allowedStatuses : (Object.keys(STATUS_CONFIG) as OrderStatus[])).map((st) => ({
    value: st,
    label: STATUS_CONFIG[st]?.label || st,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data: TrackingCreate = {
        status,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      };

      await trackingApi.addTrackingEvent(order.tracking_number, data);
      success('Tracking Updated', `Status updated to ${STATUS_CONFIG[status]?.label || status}`);
      onSuccess();
      onClose();
    } catch (err) {
      error('Failed to update tracking', extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Delivery Status"
      subtitle={`Order #${order.tracking_number} • Current: ${STATUS_CONFIG[order.status]?.label}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="New Delivery Status"
          required
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          options={statusOptions}
        />

        <Input
          label="Current Location (City / Hub / Landmark)"
          placeholder="e.g. South Delivery Hub, Chennai"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Remarks / Event Notes</label>
          <textarea
            rows={3}
            placeholder="e.g. Package arrived at distribution facility. Ready for morning dispatch."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Truck className="w-4 h-4" />}
          >
            Post Tracking Event
          </Button>
        </div>
      </form>
    </Modal>
  );
};

