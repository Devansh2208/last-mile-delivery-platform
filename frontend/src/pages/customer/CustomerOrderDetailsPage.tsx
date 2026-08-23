import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { trackingApi } from '../../api/tracking';
import { OrderResponse, TrackingResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PricingBreakdownCard } from '../../components/orders/PricingBreakdownCard';
import { TrackingTimeline } from '../../components/tracking/TrackingTimeline';
import { formatWeight, formatDate } from '../../utils/formatters';
import {
  ArrowLeft,
  MapPin,
  Scale,
  Phone,
  Search,
  RefreshCw,
} from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export const CustomerOrderDetailsPage: React.FC = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const { error } = useToast();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDetails = async (showLoadingState = true) => {
    if (!trackingNumber) return;
    if (showLoadingState) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [orderData, eventsData] = await Promise.all([
        ordersApi.getOrderByTrackingNumber(trackingNumber),
        trackingApi.getTrackingEvents(trackingNumber),
      ]);
      setOrder(orderData);
      setTrackingEvents(eventsData);
    } catch (err) {
      error('Failed to load order details', extractErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [trackingNumber]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          No order found with tracking number {trackingNumber}.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => navigate('/customer/orders')}
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customer/orders')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                {order.tracking_number}
              </h1>
              <Badge status={order.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Registered on {order.created_at ? formatDate(order.created_at) : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDetails(false)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Status
          </Button>
          <Link to={`/tracking?q=${order.tracking_number}`} target="_blank">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Search className="w-3.5 h-3.5" />}
            >
              Public Tracking Page
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Order Specs & Pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address & Customer Card */}
          <Card>
            <CardHeader
              title="Consignment & Delivery Route"
              icon={<MapPin className="w-5 h-5 text-brand-600" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Sender / Customer</span>
                <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
                <p className="text-slate-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {order.customer_phone}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivery Pincode</span>
                <p className="font-mono font-extrabold text-brand-700 text-base">{order.delivery_pincode}</p>
                <p className="text-slate-500 text-[11px]">Destination postal area</p>
              </div>

              <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Pickup Address</span>
                <p className="text-slate-800 leading-relaxed">{order.pickup_address}</p>
              </div>

              <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivery Address</span>
                <p className="text-slate-800 leading-relaxed font-medium">{order.delivery_address}</p>
              </div>
            </div>
          </Card>

          {/* Pricing Card */}
          <PricingBreakdownCard
            order={order}
            onPriceCalculated={() => fetchDetails(false)}
          />
        </div>

        {/* Right Column: Package Specs & Tracking Timeline */}
        <div className="space-y-6">
          {/* Package Info Card */}
          <Card>
            <CardHeader
              title="Package Dimensions"
              icon={<Scale className="w-5 h-5 text-brand-600" />}
            />

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Actual Weight</span>
                <span className="font-bold text-slate-800">{formatWeight(order.package_weight)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Dimensions (L×B×H)</span>
                <span className="font-mono font-semibold text-slate-800">
                  {order.length} × {order.breadth} × {order.height} cm
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Volumetric Weight</span>
                <span className="font-bold text-slate-800">{order.volumetric_weight} kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Billable Weight</span>
                <span className="font-bold text-brand-600">{order.billable_weight} kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Order Category</span>
                <span className="font-semibold text-slate-800">{order.order_type}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Payment Term</span>
                <span className="font-bold text-slate-800">{order.payment_type}</span>
              </div>
            </div>
          </Card>

          {/* Tracking Timeline */}
          <TrackingTimeline
            currentStatus={order.status}
            events={trackingEvents}
          />
        </div>
      </div>
    </div>
  );
};

