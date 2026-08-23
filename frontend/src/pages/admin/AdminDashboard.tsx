import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { agentsApi } from '../../api/agents';
import { zonesApi } from '../../api/zones';
import { AgentResponse, OrderResponse, ZoneResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { StatCard } from '../../components/ui/StatCard';
import { OrderTable } from '../../components/orders/OrderTable';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AssignOrderModal } from '../../components/agents/AssignOrderModal';
import { CreateAgentModal } from '../../components/agents/CreateAgentModal';
import { CreateZoneModal } from '../../components/zones/CreateZoneModal';
import {
  Package,
  Truck,
  Users,
  MapPin,
  CreditCard,
  Plus,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { error } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [assignModalOrder, setAssignModalOrder] = useState<OrderResponse | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  const [isCreateZoneOpen, setIsCreateZoneOpen] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, agentsData, zonesData] = await Promise.all([
        ordersApi.getOrders().catch(() => []),
        agentsApi.getAgents().catch(() => []),
        zonesApi.getZones().catch(() => []),
      ]);
      setOrders(ordersData);
      setAgents(agentsData);
      setZones(zonesData);
    } catch (err) {
      error('Failed to load dashboard metrics', extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Metrics
  const activeDeliveries = orders.filter((o) =>
    ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)
  ).length;
  const unassignedOrders = orders.filter((o) => o.status === 'CREATED').length;
  const availableAgents = agents.filter((a) => a.active && a.available).length;

  const handleAssignClick = (order: OrderResponse) => {
    setAssignModalOrder(order);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Admin Operations Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-brand-400 bg-brand-400/10 px-2.5 py-1 rounded-md border border-brand-400/20">
              Operations Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              Logistics Master Overview 🌐
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
              Real-time monitoring of fleet capacity, delivery route zones, consignment dispatch, and rate configurations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={fetchDashboardData}
              isLoading={isLoading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-brand-600 hover:bg-brand-500 text-white"
              onClick={() => setIsCreateAgentOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Agent
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={() => setIsCreateZoneOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              New Zone
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={isLoading ? '...' : orders.length}
          subtitle={`${unassignedOrders} pending dispatch assignment`}
          variant="brand"
          icon={<Package className="w-5 h-5 text-brand-600" />}
          onClick={() => navigate('/admin/orders')}
        />
        <StatCard
          title="Active Deliveries"
          value={isLoading ? '...' : activeDeliveries}
          subtitle="In transit & out for delivery"
          variant="purple"
          icon={<Truck className="w-5 h-5 text-purple-600" />}
          onClick={() => navigate('/admin/orders')}
        />
        <StatCard
          title="Available Agents"
          value={isLoading ? '...' : `${availableAgents} / ${agents.length}`}
          subtitle="Fleet ready for auto-assignment"
          variant="emerald"
          icon={<Users className="w-5 h-5 text-emerald-600" />}
          onClick={() => navigate('/admin/agents')}
        />
        <StatCard
          title="Active Zones"
          value={isLoading ? '...' : zones.filter((z) => z.active).length}
          subtitle={`${zones.length} total registered zones`}
          variant="slate"
          icon={<MapPin className="w-5 h-5 text-slate-700" />}
          onClick={() => navigate('/admin/zones')}
        />
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/admin/agents')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-xl group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Manage Agent Fleet</h4>
              <p className="text-xs text-slate-500">{agents.length} delivery drivers</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </div>

        <div
          onClick={() => navigate('/admin/zones')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Zones & Pincodes</h4>
              <p className="text-xs text-slate-500">{zones.length} delivery territories</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>

        <div
          onClick={() => navigate('/admin/rate-cards')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Rate Cards & Pricing</h4>
              <p className="text-xs text-slate-500">B2B & B2C route pricing</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader
          title="Recent Order Dispatch Queue"
          subtitle="Assign agents and oversee delivery progression"
          icon={<Package className="w-5 h-5 text-brand-600" />}
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/orders')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              All Orders ({orders.length})
            </Button>
          }
        />

        <OrderTable
          orders={orders.slice(0, 8)}
          isLoading={isLoading}
          basePath="/admin/orders"
          showAdminActions={true}
          onAssign={handleAssignClick}
        />
      </Card>

      {/* Modals */}
      <AssignOrderModal
        order={assignModalOrder}
        availableAgents={agents}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <CreateAgentModal
        isOpen={isCreateAgentOpen}
        onClose={() => setIsCreateAgentOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <CreateZoneModal
        isOpen={isCreateZoneOpen}
        onClose={() => setIsCreateZoneOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

