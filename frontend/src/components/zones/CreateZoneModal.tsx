import React, { useState } from 'react';
import { ZoneCreate } from '../../types';
import { zonesApi } from '../../api/zones';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MapPin } from 'lucide-react';

export interface CreateZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateZoneModal: React.FC<CreateZoneModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ZoneCreate>({
    name: '',
    code: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data: ZoneCreate = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description?.trim() || undefined,
      };

      await zonesApi.createZone(data);
      success('Zone Created', `Zone ${data.name} (${data.code}) created successfully.`);
      setFormData({ name: '', code: '', description: '' });
      onSuccess();
      onClose();
    } catch (err) {
      error('Failed to create zone', extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Delivery Zone"
      subtitle="Define a new geographical delivery territory"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Zone Name"
          placeholder="e.g. Bangalore North Region"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Zone Code"
          placeholder="e.g. BLR-NORTH"
          required
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          hint="Short unique uppercase identifier"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Description (Optional)</label>
          <textarea
            rows={3}
            placeholder="e.g. Covers northern districts, tech parks, and airport corridor"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            leftIcon={<MapPin className="w-4 h-4" />}
          >
            Create Zone
          </Button>
        </div>
      </form>
    </Modal>
  );
};

