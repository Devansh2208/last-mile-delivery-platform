import React, { useEffect, useState } from 'react';
import { zonesApi } from '../../api/zones';
import { RateCardResponse, ZoneResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { RateCardTable } from '../../components/pricing/RateCardTable';
import { CreateRateCardModal } from '../../components/pricing/CreateRateCardModal';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CreditCard, Plus, Calculator, Info, RefreshCw } from 'lucide-react';

export const AdminRateCardsPage: React.FC = () => {
  const { error } = useToast();
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [rateCards, setRateCards] = useState<RateCardResponse[]>(() => {
    // Session persistent stored created rate cards for UI view
    const saved = localStorage.getItem('demo_rate_cards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchZones = async () => {
    setIsLoading(true);
    try {
      const data = await zonesApi.getZones();
      setZones(data);
    } catch (err) {
      error('Failed to load delivery zones', extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleRateCardCreated = (newRateCard: RateCardResponse) => {
    setRateCards((prev) => {
      const updated = [newRateCard, ...prev];
      localStorage.setItem('demo_rate_cards', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-600" />
            Rate Cards & Pricing Configurations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Establish origin-to-destination tariff matrices for B2B and B2C deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchZones}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Zones
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Rate Card
          </Button>
        </div>
      </div>

      {/* Pricing Formula Explainer Banner */}
      <Card className="bg-gradient-to-r from-brand-900 to-slate-900 text-white border-none shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-2">
          <div>
            <div className="flex items-center gap-2 text-brand-300 font-bold text-xs uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              Backend Pricing Engine Formula
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Automated Route & Volumetric Calculation
            </h3>
            <div className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              When pricing is computed on an order, the system evaluates:
              <br />
              <code className="text-brand-300 font-mono text-[11px] block mt-1">
                Shipping Price = Base Rate + (Billable Weight × Rate per KG)
              </code>
              <code className="text-amber-300 font-mono text-[11px] block mt-0.5">
                Total Price = Shipping Price + (COD Surcharge if Payment is COD)
              </code>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-xs space-y-1">
            <span className="text-slate-300 text-[10px] uppercase font-bold block">
              Volumetric Divisor
            </span>
            <span className="font-mono text-white font-bold text-sm">Divisor: 5000</span>
            <p className="text-[11px] text-slate-300">
              Billable weight = max(actual kg, (L×B×H)/5000)
            </p>
          </div>
        </div>
      </Card>

      {/* Backend API Capability Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Active Rate Matrix Storage</p>
          <p className="text-blue-700 leading-relaxed text-[11px]">
            New rate cards created via the button above are transmitted directly to the backend
            database at <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">POST /rate-cards/</code>.
            Once created, any order moving along the configured origin and destination zones will
            match the tariff rule during calculation!
          </p>
        </div>
      </div>

      {/* Rate Cards Table */}
      <RateCardTable
        rateCards={rateCards}
        zones={zones}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* Create Rate Card Modal */}
      <CreateRateCardModal
        zones={zones}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRateCardCreated}
      />
    </div>
  );
};

