import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { agentsApi } from '../../api/agents';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setPhone('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      error('Validation Error', 'Agent name and phone number are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await agentsApi.createAgent({
        name: name.trim(),
        phone: phone.trim(),
      });
      success('Agent Created', `${name.trim()} has been added to the fleet.`);
      reset();
      onClose();
      await onSuccess?.();
    } catch (err) {
      error('Failed to create agent', extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Delivery Agent"
      subtitle="Create a new agent profile for dispatch assignment."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Agent Name"
          placeholder="e.g. Rahul Sharma"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="e.g. 9876543210"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Create Agent
          </Button>
        </div>
      </form>
    </Modal>
  );
};
