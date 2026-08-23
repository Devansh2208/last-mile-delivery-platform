import React from 'react';
import { RateCardResponse, ZoneResponse } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../ui/EmptyState';
import { CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

export interface RateCardTableProps {
  rateCards: RateCardResponse[];
  zones: ZoneResponse[];
  onCreateClick?: () => void;
}

export const RateCardTable: React.FC<RateCardTableProps> = ({
  rateCards,
  zones,
  onCreateClick,
}) => {
  const getZoneName = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone ? `${zone.name} (${zone.code})` : zoneId.substring(0, 8);
  };

  if (rateCards.length === 0) {
    return (
      <EmptyState
        title="No Rate Cards Configured"
        description="Configure pricing rules between origin and destination zones to enable automated order price calculation."
        icon={<CreditCard className="w-8 h-8 text-slate-400" />}
        actionLabel={onCreateClick ? 'Create Rate Card' : undefined}
        onAction={onCreateClick}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Route (Origin → Destination)</th>
              <th className="py-3.5 px-4">Order Type</th>
              <th className="py-3.5 px-4">Base Rate</th>
              <th className="py-3.5 px-4">Rate / KG</th>
              <th className="py-3.5 px-4">COD Surcharge</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {rateCards.map((rc) => (
              <tr key={rc.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-4 font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800">{getZoneName(rc.origin_zone_id)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-800">{getZoneName(rc.destination_zone_id)}</span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {rc.order_type}
                  </span>
                </td>

                <td className="py-4 px-4 font-bold text-slate-900">
                  {formatCurrency(rc.base_rate)}
                </td>

                <td className="py-4 px-4 font-bold text-slate-900">
                  {formatCurrency(rc.rate_per_kg)} / kg
                </td>

                <td className="py-4 px-4 font-medium text-amber-800">
                  {formatCurrency(rc.cod_surcharge)}
                </td>

                <td className="py-4 px-4">
                  {rc.active ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

