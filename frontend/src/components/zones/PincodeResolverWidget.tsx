import React, { useState } from 'react';
import { zonesApi } from '../../api/zones';
import { ZoneResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';

export const PincodeResolverWidget: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resolvedZone, setResolvedZone] = useState<ZoneResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) return;

    setIsLoading(true);
    setResolvedZone(null);
    setErrorMsg(null);

    try {
      const zone = await zonesApi.resolveZoneByPincode(pincode.trim());
      setResolvedZone(zone);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200">
      <CardHeader
        title="Pincode Coverage Resolver"
        subtitle="Verify which delivery zone serves any specific postal code"
        icon={<MapPin className="w-5 h-5 text-brand-600" />}
      />

      <form onSubmit={handleResolve} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Enter 6-digit Pincode (e.g. 560001)"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setResolvedZone(null);
                setErrorMsg(null);
              }}
              required
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            isLoading={isLoading}
            leftIcon={<Search className="w-4 h-4" />}
          >
            Resolve
          </Button>
        </div>

        {resolvedZone && (
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Zone Found: {resolvedZone.name}</span>
              <span className="font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[11px]">
                {resolvedZone.code}
              </span>
            </div>
            {resolvedZone.description && (
              <p className="text-emerald-700">{resolvedZone.description}</p>
            )}
            <p className="text-[11px] text-emerald-600">
              Status: {resolvedZone.active ? 'Active & Servicing' : 'Currently Inactive'}
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-xl text-xs flex items-center gap-2.5 text-rose-800 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>
    </Card>
  );
};

