import React, { useState } from 'react';
import { ZoneMappingCreate, ZoneResponse } from '../../types';
import { zonesApi } from '../../api/zones';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Hash } from 'lucide-react';

export interface AddMappingModalProps {
  zone: ZoneResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddMappingModal: React.FC<AddMappingModalProps> = ({
  zone,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincode, setPincode] = useState('');

  if (!zone) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) {
      error('Validation', 'Please enter a valid pincode.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data: ZoneMappingCreate = {
        pincode: pincode.trim(),
      };

      await zonesApi.createZoneMapping(zone.id, data);
      success('Pincode Mapped', `Pincode ${data.pincode} mapped to ${zone.name}`);
      setPincode('');
      onSuccess();
      onClose();
    } catch (err) {
      error('Failed to map pincode', extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Pincode Mapping"
      subtitle={`Zone: ${zone.name} (${zone.code})`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Postal Pincode"
          placeholder="e.g. 560001"
          required
          minLength={3}
          maxLength={10}
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          hint="Deliveries to this postal code will automatically resolve to this zone"
        />

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Hash className="w-4 h-4" />}
          >
            Save Pincode Mapping
          </Button>
        </div>
      </form>
    </Modal>
  );
};

