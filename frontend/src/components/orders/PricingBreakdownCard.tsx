import React, { useState } from 'react';
import { OrderResponse, PriceCalculationResult } from '../../types';
import { pricingApi } from '../../api/pricing';
import { formatCurrency, formatKg } from '../../utils/formatters';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calculator, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { extractErrorMessage } from '../../api/client';

export interface PricingBreakdownCardProps {
  order: OrderResponse;
  onPriceCalculated?: (result: PriceCalculationResult) => void;
}

export const PricingBreakdownCard: React.FC<PricingBreakdownCardProps> = ({
  order,
  onPriceCalculated,
}) => {
  const { success, error } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<PriceCalculationResult | null>(null);

  const handleCalculatePrice = async () => {
    setIsCalculating(true);
    try {
      const result = await pricingApi.calculateOrderPrice(order.tracking_number);
      setCalculationResult(result);
      if (onPriceCalculated) {
        onPriceCalculated(result);
      }
      success('Pricing Calculated', `Total charge: ${formatCurrency(result.total_price)}`);
    } catch (err) {
      const msg = extractErrorMessage(err);
      error('Pricing Calculation Failed', msg);
    } finally {
      setIsCalculating(false);
    }
  };

  const actualKg = order.package_weight / 1000;
  const volKg = order.volumetric_weight;
  const billableKg = order.billable_weight;

  // Use calculationResult if available, otherwise order stored values
  const hasPrice = order.calculated_charge !== null || calculationResult !== null;
  const totalPrice = calculationResult
    ? calculationResult.total_price
    : order.calculated_charge || 0;
  const baseRate = calculationResult ? calculationResult.base_rate : null;
  const ratePerKg = calculationResult ? calculationResult.rate_per_kg : null;
  const codSurcharge = calculationResult
    ? calculationResult.cod_surcharge
    : order.cod_surcharge || 0;

  return (
    <Card className="border-brand-200/60 bg-gradient-to-b from-white to-brand-50/20">
      <CardHeader
        title="Pricing & Billing Breakdown"
        subtitle="Computed strictly by backend pricing engine"
        icon={<Calculator className="w-5 h-5 text-brand-600" />}
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={handleCalculatePrice}
            isLoading={isCalculating}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            {hasPrice ? 'Recalculate Price' : 'Calculate Price'}
          </Button>
        }
      />

      <div className="space-y-4 text-xs">
        {/* Weight specs comparison */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-slate-200/80 text-center">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Actual Weight
            </span>
            <span className="font-bold text-slate-800">{formatKg(actualKg)}</span>
            <span className="text-[10px] text-slate-400 block">({order.package_weight} g)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Volumetric Weight
            </span>
            <span className="font-bold text-slate-800">{formatKg(volKg)}</span>
            <span className="text-[10px] text-slate-400 block">
              ({order.length}×{order.breadth}×{order.height} / 5000)
            </span>
          </div>
          <div className="bg-brand-50/70 rounded-lg p-1 border border-brand-100">
            <span className="text-[10px] text-brand-700 block uppercase font-bold">
              Billable Weight
            </span>
            <span className="font-extrabold text-brand-900 text-sm">{formatKg(billableKg)}</span>
            <span className="text-[10px] text-brand-600 block">max(actual, vol)</span>
          </div>
        </div>

        {/* Pricing breakdown lines */}
        {hasPrice ? (
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2.5">
            {baseRate !== null && (
              <div className="flex justify-between text-slate-600">
                <span>Base Route Rate</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatCurrency(baseRate)}
                </span>
              </div>
            )}

            {ratePerKg !== null && (
              <div className="flex justify-between text-slate-600">
                <span>
                  Weight Charge ({formatKg(billableKg)} × {formatCurrency(ratePerKg)}/kg)
                </span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatCurrency(billableKg * ratePerKg)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <span>Payment Mode:</span>
                <span className="font-bold text-slate-800">{order.payment_type}</span>
              </span>
              <span>{order.payment_type === 'COD' ? 'Cash on Delivery' : 'Prepaid'}</span>
            </div>

            {order.payment_type === 'COD' && (
              <div className="flex justify-between text-amber-700">
                <span>COD Surcharge</span>
                <span className="font-mono font-semibold">{formatCurrency(codSurcharge)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-slate-900">Total Calculated Charge</span>
                <p className="text-[10px] text-slate-400">Taxes & route tariffs included</p>
              </div>
              <span className="text-xl font-extrabold font-mono text-brand-600">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-bold text-amber-900">Price Pending Calculation</h5>
              <p className="text-amber-700 text-xs mt-0.5">
                Click "Calculate Price" above to evaluate matching route rate cards from pickup zone
                to delivery zone.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

