import React, { useState } from 'react';
import { OrderType, RateCardCreate, RateCardResponse, ZoneResponse } from '../../types';
import { pricingApi } from '../../api/pricing';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { CreditCard } from 'lucide-react';

export interface CreateRateCardModalProps {
  zones: ZoneResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRateCard: RateCardResponse) => void;
}

export const CreateRateCardModal: React.FC<CreateRateCardModalProps> = ({
  zones,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [originZoneId, setOriginZoneId] = useState(zones[0]?.id || '');
  const [destinationZoneId, setDestinationZoneId] = useState(zones[1]?.id || zones[0]?.id || '');
  const [orderType, setOrderType] = useState<OrderType>('B2C');
  const [baseRate, setBaseRate] = useState<number>(50);
  const [ratePerKg, setRatePerKg] = useState<number>(20);
  const [codSurcharge, setCodSurcharge] = useState<number>(30);

  // Sync if zones loaded
  React.useEffect(() => {
    if (zones.length > 0) {
      if (!originZoneId) setOriginZoneId(zones[0].id);
      if (!destinationZoneId) setDestinationZoneId(zones[1]?.id || zones[0].id);
    }
  }, [zones, originZoneId, destinationZoneId]);

  const zoneOptions = zones.map((z) => ({
    value: z.id,
    label: `${z.name} (${z.code})`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originZoneId || !destinationZoneId) {
      error('Validation', 'Please select both origin and destination zones.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data: RateCardCreate = {
        origin_zone_id: originZoneId,
        destination_zone_id: destinationZoneId,
        order_type: orderType,
        base_rate: parseInt(String(baseRate), 10),
        rate_per_kg: parseInt(String(ratePerKg), 10),
        cod_surcharge: parseInt(String(codSurcharge), 10),
      };

      const result = await pricingApi.createRateCard(data);
      success('Rate Card Created', 'Route rate tariff established successfully.');
      onSuccess(result);
      onClose();
    } catch (err) {
      error('Failed to create rate card', extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Route Rate Card"
      subtitle="Configure pricing tariffs between origin and destination zones"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Origin Pickup Zone"
            required
            value={originZoneId}
            onChange={(e) => setOriginZoneId(e.target.value)}
            options={zoneOptions}
          />

          <Select
            label="Destination Delivery Zone"
            required
            value={destinationZoneId}
            onChange={(e) => setDestinationZoneId(e.target.value)}
            options={zoneOptions}
          />
        </div>

        <Select
          label="Applicable Order Type"
          required
          value={orderType}
          onChange={(e) => setOrderType(e.target.value as OrderType)}
          options={[
            { value: 'B2C', label: 'B2C (Business to Consumer)' },
            { value: 'B2B', label: 'B2B (Business to Business)' },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Base Rate (₹)"
            type="number"
            min="0"
            required
            value={baseRate}
            onChange={(e) => setBaseRate(parseInt(e.target.value) || 0)}
          />

          <Input
            label="Rate / KG (₹)"
            type="number"
            min="0"
            required
            value={ratePerKg}
            onChange={(e) => setRatePerKg(parseInt(e.target.value) || 0)}
          />

          <Input
            label="COD Surcharge (₹)"
            type="number"
            min="0"
            required
            value={codSurcharge}
            onChange={(e) => setCodSurcharge(parseInt(e.target.value) || 0)}
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
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            Save Rate Card
          </Button>
        </div>
      </form>
    </Modal>
  );
};

