import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderCreate, OrderType, PaymentType, ZoneResponse } from '../../types';
import { ordersApi } from '../../api/orders';
import { zonesApi } from '../../api/zones';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardHeader } from '../ui/Card';
import {
  PackagePlus,
  MapPin,
  Scale,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { formatKg } from '../../utils/formatters';

export const CreateOrderForm: React.FC<{ onSuccessPath?: string }> = ({
  onSuccessPath = '/customer/orders',
}) => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [isLoadingZones, setIsLoadingZones] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<OrderCreate>({
    customer_name: '',
    customer_phone: '',
    pickup_address: '',
    delivery_address: '',
    delivery_pincode: '',
    pickup_zone_id: '',
    package_weight: 1000, // 1000g = 1kg
    length: 20, // 20cm
    breadth: 15, // 15cm
    height: 10, // 10cm
    order_type: 'B2C',
    payment_type: 'PREPAID',
  });

  // Pincode resolution feedback state
  const [pincodeCheckLoading, setPincodeCheckLoading] = useState(false);
  const [resolvedZone, setResolvedZone] = useState<ZoneResponse | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // Load Zones on mount
  useEffect(() => {
    const fetchZones = async () => {
      setIsLoadingZones(true);
      try {
        const fetchedZones = await zonesApi.getZones();
        setZones(fetchedZones);
        if (fetchedZones.length > 0) {
          setFormData((prev) => ({
            ...prev,
            pickup_zone_id: fetchedZones[0].id,
          }));
        }
      } catch (err) {
        error('Failed to load zones', extractErrorMessage(err));
      } finally {
        setIsLoadingZones(false);
      }
    };
    fetchZones();
  }, [error]);

  // Check delivery pincode automatically when length is >= 3
  useEffect(() => {
    const pincode = formData.delivery_pincode.trim();
    if (pincode.length < 3) {
      setResolvedZone(null);
      setPincodeError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setPincodeCheckLoading(true);
      setPincodeError(null);
      try {
        const zone = await zonesApi.resolveZoneByPincode(pincode);
        setResolvedZone(zone);
        setPincodeError(null);
      } catch {
        setResolvedZone(null);
        setPincodeError('No active delivery zone found for this pincode');
      } finally {
        setPincodeCheckLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.delivery_pincode]);

  // Calculations
  const actualWeightKg = (Number(formData.package_weight) || 0) / 1000;
  const volumetricWeightKg =
    ((Number(formData.length) || 0) *
      (Number(formData.breadth) || 0) *
      (Number(formData.height) || 0)) /
    5000;
  const billableWeightKg = Math.max(actualWeightKg, volumetricWeightKg);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pickup_zone_id) {
      error('Validation Error', 'Please select a valid pickup zone.');
      return;
    }

    if (!formData.delivery_pincode.trim()) {
      error('Validation Error', 'Please enter a delivery pincode.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload: OrderCreate = {
        ...formData,
        package_weight: parseInt(String(formData.package_weight), 10),
        length: parseInt(String(formData.length), 10),
        breadth: parseInt(String(formData.breadth), 10),
        height: parseInt(String(formData.height), 10),
      };

      const newOrder = await ordersApi.createOrder(orderPayload);
      success('Order Created Successfully!', `Tracking Number: ${newOrder.tracking_number}`);
      navigate(`${onSuccessPath}/${newOrder.tracking_number}`);
    } catch (err) {
      error('Order Creation Failed', extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* 1. Customer & Route Information */}
      <Card>
        <CardHeader
          title="Customer & Address Information"
          subtitle="Sender and recipient delivery destinations"
          icon={<MapPin className="w-5 h-5 text-brand-600" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Customer Full Name"
            placeholder="e.g. Rajesh Sharma"
            required
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          />

          <Input
            label="Customer Phone Number"
            placeholder="e.g. 9876543210"
            required
            value={formData.customer_phone}
            onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
          />

          <div className="md:col-span-2">
            <Select
              label="Pickup Zone"
              required
              disabled={isLoadingZones}
              value={formData.pickup_zone_id}
              onChange={(e) => setFormData({ ...formData, pickup_zone_id: e.target.value })}
              options={zones.map((z) => ({
                value: z.id,
                label: `${z.name} (${z.code})`,
              }))}
              hint={
                zones.length === 0 && !isLoadingZones
                  ? 'No active zones available. Ask admin to create a zone first.'
                  : undefined
              }
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Pickup Full Address"
              placeholder="e.g. Unit 4, Commercial Hub, Guindy, Chennai"
              required
              value={formData.pickup_address}
              onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Delivery Full Address"
              placeholder="e.g. Flat 302, Green Meadows, Indiranagar, Bengaluru"
              required
              value={formData.delivery_address}
              onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Delivery Pincode"
              placeholder="e.g. 560001"
              required
              value={formData.delivery_pincode}
              onChange={(e) => setFormData({ ...formData, delivery_pincode: e.target.value })}
              rightIcon={
                pincodeCheckLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                ) : resolvedZone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : pincodeError ? (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                ) : null
              }
            />

            {resolvedZone && (
              <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Delivery Pincode verified: Mapped to Zone <strong>{resolvedZone.name} ({resolvedZone.code})</strong>
                </span>
              </div>
            )}

            {pincodeError && (
              <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{pincodeError}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 2. Package Specifications & Weight */}
      <Card>
        <CardHeader
          title="Package Dimensions & Weight"
          subtitle="Used by backend volumetric and billable weight engine"
          icon={<Scale className="w-5 h-5 text-brand-600" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Actual Weight (grams)"
            type="number"
            min="1"
            required
            value={formData.package_weight}
            onChange={(e) => setFormData({ ...formData, package_weight: parseInt(e.target.value) || 0 })}
            hint={`${formatKg(actualWeightKg)}`}
          />

          <Input
            label="Length (cm)"
            type="number"
            min="1"
            required
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value) || 0 })}
          />

          <Input
            label="Breadth (cm)"
            type="number"
            min="1"
            required
            value={formData.breadth}
            onChange={(e) => setFormData({ ...formData, breadth: parseInt(e.target.value) || 0 })}
          />

          <Input
            label="Height (cm)"
            type="number"
            min="1"
            required
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
          />
        </div>

        {/* Live Weight Preview Card */}
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[11px] text-slate-500 block uppercase font-medium">Actual Weight</span>
            <span className="font-bold text-slate-900 text-sm">{formatKg(actualWeightKg)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block uppercase font-medium">Volumetric Weight</span>
            <span className="font-bold text-slate-900 text-sm">{formatKg(volumetricWeightKg)}</span>
            <span className="text-[10px] text-slate-400 block">(L×B×H / 5000)</span>
          </div>
          <div className="bg-brand-100/60 p-2 rounded-lg border border-brand-200">
            <span className="text-[11px] text-brand-800 block uppercase font-bold">Billable Weight</span>
            <span className="font-extrabold text-brand-900 text-base">{formatKg(billableWeightKg)}</span>
          </div>
        </div>
      </Card>

      {/* 3. Order Classification & Payment Type */}
      <Card>
        <CardHeader
          title="Order Type & Payment Method"
          subtitle="Determines pricing tariff & COD surcharge"
          icon={<CreditCard className="w-5 h-5 text-brand-600" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Order Type"
            required
            value={formData.order_type}
            onChange={(e) => setFormData({ ...formData, order_type: e.target.value as OrderType })}
            options={[
              { value: 'B2C', label: 'B2C (Business to Consumer)' },
              { value: 'B2B', label: 'B2B (Business to Business)' },
            ]}
          />

          <Select
            label="Payment Type"
            required
            value={formData.payment_type}
            onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as PaymentType })}
            options={[
              { value: 'PREPAID', label: 'Prepaid (Card / UPI / NetBanking)' },
              { value: 'COD', label: 'COD (Cash on Delivery)' },
            ]}
            hint={formData.payment_type === 'COD' ? 'Applicable COD surcharge will apply upon price calculation.' : undefined}
          />
        </div>
      </Card>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<PackagePlus className="w-4 h-4" />}
        >
          Create Delivery Order
        </Button>
      </div>
    </form>
  );
};

