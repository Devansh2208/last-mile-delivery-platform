import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { OrderResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { StatCard } from '../../components/ui/StatCard';
import { OrderTable } from '../../components/orders/OrderTable';
import { Card, CardHeader } from '../../components/ui/Card';
import { UpdateStatusModal } from '../../components/tracking/UpdateStatusModal';
import { Truck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const AgentDashboard: React.FC = () => {
  const { error } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status update modal state
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const assignedOrders = orders.filter((o) =>
    ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)
  );
  const awaitingPickup = orders.filter((o) => o.status === 'ASSIGNED').length;
  const outForDelivery = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const failedCount = orders.filter((o) => ['FAILED', 'RESCHEDULED'].includes(o.status)).length;

  const handleUpdateClick = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
              Delivery Operations
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              Agent Delivery Dispatch 🚚
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
              Manage your delivery runs, execute package pickups, update tracking checkpoints, and record handoffs.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Awaiting Pickup"
          value={isLoading ? '...' : awaitingPickup}
          subtitle="Orders assigned for pickup"
          variant="amber"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          onClick={() => navigate('/agent/orders')}
        />
        <StatCard
          title="Out For Delivery"
          value={isLoading ? '...' : outForDelivery}
          subtitle="Loaded for final dropoff"
          variant="purple"
          icon={<Truck className="w-5 h-5 text-purple-600" />}
          onClick={() => navigate('/agent/orders')}
        />
        <StatCard
          title="Delivered Successfully"
          value={isLoading ? '...' : deliveredCount}
          subtitle="Completed deliveries"
          variant="emerald"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          onClick={() => navigate('/agent/orders')}
        />
        <StatCard
          title="Delivery Attempts / Failed"
          value={isLoading ? '...' : failedCount}
          subtitle="Requires reattempt"
          variant="rose"
          icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
          onClick={() => navigate('/agent/orders')}
        />
      </div>

      {/* Active Run Table */}
      <Card>
        <CardHeader
          title="Active Delivery Queue"
          subtitle="Parcels in progress requiring transit or delivery status updates"
          icon={<Truck className="w-5 h-5 text-brand-600" />}
        />

        <OrderTable
          orders={assignedOrders}
          isLoading={isLoading}
          basePath="/agent/orders"
          showAgentActions={true}
          onUpdateStatus={handleUpdateClick}
        />
      </Card>

      {/* Update Status Modal */}
      <UpdateStatusModal
        order={selectedOrder}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={fetchOrders}
      />
    </div>
  );
};

