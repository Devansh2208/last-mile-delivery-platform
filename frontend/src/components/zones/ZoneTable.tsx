import React, { useState } from 'react';
import { ZoneMappingResponse, ZoneResponse } from '../../types';
import { zonesApi } from '../../api/zones';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';
import { TableSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { MapPin, Plus, Hash, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';

export interface ZoneTableProps {
  zones: ZoneResponse[];
  isLoading?: boolean;
  onAddMapping: (zone: ZoneResponse) => void;
  isAdmin?: boolean;
}

export const ZoneTable: React.FC<ZoneTableProps> = ({
  zones,
  isLoading = false,
  onAddMapping,
  isAdmin = false,
}) => {
  const { error } = useToast();
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
  const [mappings, setMappings] = useState<Record<string, ZoneMappingResponse[]>>({});
  const [loadingMappings, setLoadingMappings] = useState<Record<string, boolean>>({});

  const toggleExpandZone = async (zoneId: string) => {
    if (expandedZoneId === zoneId) {
      setExpandedZoneId(null);
      return;
    }

    setExpandedZoneId(zoneId);

    // Fetch mappings if not already cached
    if (!mappings[zoneId]) {
      setLoadingMappings((prev) => ({ ...prev, [zoneId]: true }));
      try {
        const fetchedMappings = await zonesApi.getZoneMappings(zoneId);
        setMappings((prev) => ({ ...prev, [zoneId]: fetchedMappings }));
      } catch (err) {
        error('Failed to load mappings', extractErrorMessage(err));
      } finally {
        setLoadingMappings((prev) => ({ ...prev, [zoneId]: false }));
      }
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  if (zones.length === 0) {
    return (
      <EmptyState
        title="No Delivery Zones"
        description="No operational delivery zones are defined. Click 'Create Zone' to add one."
        icon={<MapPin className="w-8 h-8 text-slate-400" />}
      />
    );
  }

  return (
    <div className="space-y-3">
      {zones.map((zone) => {
        const isExpanded = expandedZoneId === zone.id;
        const zoneMappings = mappings[zone.id] || [];
        const isLoadingMap = loadingMappings[zone.id];

        return (
          <div
            key={zone.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all duration-200"
          >
            {/* Zone Main Row */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{zone.name}</h4>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {zone.code}
                    </span>
                    {zone.active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </div>
                  {zone.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{zone.description}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddMapping(zone)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Pincode
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleExpandZone(zone.id)}
                  rightIcon={
                    isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  }
                >
                  {isExpanded ? 'Hide Pincodes' : 'View Pincodes'}
                </Button>
              </div>
            </div>

            {/* Expandable Mapped Pincodes Drawer */}
            {isExpanded && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-brand-600" />
                  Mapped Delivery Pincodes
                </h5>

                {isLoadingMap ? (
                  <div className="py-4 text-center text-xs text-slate-400">Loading pincodes...</div>
                ) : zoneMappings.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-2">
                    No pincodes mapped to this zone yet. Add pincodes so customer orders can resolve to this zone.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {zoneMappings.map((m) => (
                      <span
                        key={m.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 shadow-2xs"
                      >
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {m.pincode}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

