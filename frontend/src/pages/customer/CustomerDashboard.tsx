import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ordersApi } from '../../api/orders';
import { OrderResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { StatCard } from '../../components/ui/StatCard';
import { OrderTable } from '../../components/orders/OrderTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Search,
  ArrowRight,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackInput, setTrackInput] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await ordersApi.getOrders();
        setOrders(data);
      } catch (err) {
        error('Failed to load orders', extractErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [error]);

  const activeDeliveries = orders.filter((o) =>
    ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)
  ).length;

  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const failedRescheduled = orders.filter((o) =>
    ['FAILED', 'RESCHEDULED', 'CANCELLED'].includes(o.status)
  ).length;

  const recentOrders = orders.slice(0, 5);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      navigate(`/tracking?q=${encodeURIComponent(trackInput.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Track */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-brand-500/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name || 'Customer'}! 👋
            </h1>
            <p className="mt-1 text-sm text-brand-100 max-w-xl">
              Track shipments in real time, generate orders, and review billing tariffs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/customer/orders/create">
              <Button
                variant="secondary"
                size="md"
                className="bg-white text-brand-900 hover:bg-brand-50 shadow-md font-bold"
                leftIcon={<PlusCircle className="w-4 h-4 text-brand-600" />}
              >
                Create Delivery Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Track Input Bar embedded inside banner */}
        <div className="mt-6 pt-6 border-t border-white/15 relative z-10 max-w-xl">
          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Enter Tracking ID (e.g. LM-XXXXXX)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white focus:text-slate-900 text-white placeholder:text-brand-200 border border-white/20 focus:border-white text-xs sm:text-sm focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-brand-200 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="bg-white text-brand-700 hover:bg-brand-50 font-bold"
            >
              Track
            </Button>
          </form>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={isLoading ? '...' : orders.length}
          subtitle="Lifetime registered parcels"
          variant="brand"
          icon={<Package className="w-5 h-5 text-brand-600" />}
          onClick={() => navigate('/customer/orders')}
        />
        <StatCard
          title="Active Deliveries"
          value={isLoading ? '...' : activeDeliveries}
          subtitle="In transit & out for delivery"
          variant="purple"
          icon={<Truck className="w-5 h-5 text-purple-600" />}
          onClick={() => navigate('/customer/orders')}
        />
        <StatCard
          title="Delivered Successfully"
          value={isLoading ? '...' : deliveredOrders}
          subtitle="Completed deliveries"
          variant="emerald"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          onClick={() => navigate('/customer/orders')}
        />
        <StatCard
          title="Exceptions / Failed"
          value={isLoading ? '...' : failedRescheduled}
          subtitle="Rescheduled or cancelled"
          variant="rose"
          icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
          onClick={() => navigate('/customer/orders')}
        />
      </div>

      {/* Recent Orders Section */}
      <Card>
        <CardHeader
          title="Recent Delivery Orders"
          subtitle="Latest consignments created under your account"
          icon={<Package className="w-5 h-5 text-brand-600" />}
          action={
            <Link to="/customer/orders">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All ({orders.length})
              </Button>
            </Link>
          }
        />

        <OrderTable
          orders={recentOrders}
          isLoading={isLoading}
          basePath="/customer/orders"
        />
      </Card>
    </div>
  );
};

