import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { trackingApi } from '../../api/tracking';
import { OrderResponse, TrackingResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { TrackingTimeline } from '../../components/tracking/TrackingTimeline';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export const PublicTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [trackingNumber, setTrackingNumber] = useState(initialQuery);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTracking = async (numberToTrack: string) => {
    if (!numberToTrack.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setOrder(null);
    setTrackingEvents([]);

    try {
      // 1. Fetch public tracking events
      const events = await trackingApi.getTrackingEvents(numberToTrack.trim());
      setTrackingEvents(events);

      // 2. Fetch order details if possible (or fallback if unauthenticated)
      try {
        const orderData = await ordersApi.getOrderByTrackingNumber(numberToTrack.trim());
        setOrder(orderData);
      } catch {
        // If unauthenticated, we can construct minimal order response from latest tracking event
        if (events.length > 0) {
          const latest = events[events.length - 1];
          setOrder({
            id: latest.order_id,
            tracking_number: numberToTrack.trim(),
            customer_name: 'Consignment Recipient',
            customer_phone: '••••••••',
            pickup_address: 'Registered Origin Hub',
            delivery_address: latest.location || 'Destination Area',
            delivery_pincode: 'Serviceable',
            pickup_zone_id: null,
            delivery_zone_id: null,
            package_weight: 1000,
            length: 0,
            breadth: 0,
            height: 0,
            volumetric_weight: 0,
            billable_weight: 0,
            order_type: 'B2C',
            payment_type: 'PREPAID',
            calculated_charge: null,
            cod_surcharge: 0,
            status: latest.status as any,
          });
        }
      }

      if (events.length === 0 && !order) {
        setErrorMessage(`No tracking records found for "${numberToTrack.trim()}". Please check your tracking number.`);
      }
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setTrackingNumber(initialQuery);
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSearchParams({ q: trackingNumber.trim() });
      fetchTracking(trackingNumber.trim());
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-start py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Hero Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 p-2 px-3 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold mb-3">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-Time Parcel Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Track Your Delivery
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Enter your LastMile tracking consignment number to see real-time updates and delivery status.
        </p>

        {/* Tracking Search Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. LM-8A7B6C5D4E"
              required
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 text-sm font-mono placeholder:font-sans bg-white shadow-xs focus:outline-none transition-all"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isLoading}
            className="sm:w-auto w-full py-3"
            leftIcon={<Truck className="w-4 h-4" />}
          >
            Track Parcel
          </Button>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 flex items-center justify-center">
          <Spinner size="lg" label="Looking up tracking data..." />
        </div>
      )}

      {/* Error / Not Found Alert */}
      {!isLoading && errorMessage && (
        <div className="w-full p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5 text-rose-900 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Tracking Lookup Failed</h4>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Results View */}
      {!isLoading && order && (
        <div className="w-full space-y-6 animate-in fade-in duration-300">
          {/* Tracking Result Summary Banner */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Consignment Number
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900">
                {order.tracking_number}
              </h2>
              {order.created_at && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Booked on {formatDate(order.created_at)}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Current Status
              </span>
              <Badge status={order.status} size="md" />
            </div>
          </div>

          {/* Delivery Timeline */}
          <TrackingTimeline
            currentStatus={order.status}
            events={trackingEvents}
          />
        </div>
      )}
    </div>
  );
};

