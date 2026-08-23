import React, { useEffect, useState } from 'react';
import { zonesApi } from '../../api/zones';
import { ZoneResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { ZoneTable } from '../../components/zones/ZoneTable';
import { CreateZoneModal } from '../../components/zones/CreateZoneModal';
import { AddMappingModal } from '../../components/zones/AddMappingModal';
import { PincodeResolverWidget } from '../../components/zones/PincodeResolverWidget';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { MapPin, Plus, RefreshCw, CheckCircle2, Globe } from 'lucide-react';

export const AdminZonesPage: React.FC = () => {
  const { error } = useToast();
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isCreateZoneOpen, setIsCreateZoneOpen] = useState(false);
  const [selectedZoneForMapping, setSelectedZoneForMapping] = useState<ZoneResponse | null>(null);
  const [isAddMappingOpen, setIsAddMappingOpen] = useState(false);

  const fetchZones = async () => {
    setIsLoading(true);
    try {
      const data = await zonesApi.getZones();
      setZones(data);
    } catch (err) {
      error('Failed to load zones', extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleAddMappingClick = (zone: ZoneResponse) => {
    setSelectedZoneForMapping(zone);
    setIsAddMappingOpen(true);
  };

  const activeZones = zones.filter((z) => z.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-600" />
            Delivery Zones & Pincode Coverage
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure geographical delivery territories, map serviceable pincodes, and test route coverage.
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
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateZoneOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Zone
          </Button>
        </div>
      </div>

      {/* Zone KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Zones"
          value={isLoading ? '...' : zones.length}
          subtitle="Configured geographic zones"
          variant="brand"
          icon={<MapPin className="w-5 h-5 text-brand-600" />}
        />
        <StatCard
          title="Active & Servicing"
          value={isLoading ? '...' : activeZones}
          subtitle="Available for order allocation"
          variant="emerald"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Coverage Capability"
          value="Pincode Lookup"
          subtitle="Real-time delivery resolution"
          variant="purple"
          icon={<Globe className="w-5 h-5 text-purple-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Zones List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Operational Delivery Zones ({zones.length})</h3>
          <ZoneTable
            zones={zones}
            isLoading={isLoading}
            onAddMapping={handleAddMappingClick}
            isAdmin={true}
          />
        </div>

        {/* Right 1 Col: Pincode Coverage Resolver Widget */}
        <div>
          <PincodeResolverWidget />
        </div>
      </div>

      {/* Modals */}
      <CreateZoneModal
        isOpen={isCreateZoneOpen}
        onClose={() => setIsCreateZoneOpen(false)}
        onSuccess={fetchZones}
      />

      <AddMappingModal
        zone={selectedZoneForMapping}
        isOpen={isAddMappingOpen}
        onClose={() => setIsAddMappingOpen(false)}
        onSuccess={fetchZones}
      />
    </div>
  );
};

