import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { agentsApi } from '../../api/agents';
import { AgentResponse, OrderResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { OrderTable } from '../../components/orders/OrderTable';
import { OrderFilters, OrderFilterState } from '../../components/orders/OrderFilters';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { AssignOrderModal } from '../../components/agents/AssignOrderModal';
import { Package, PlusCircle, RefreshCw } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { error } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('ALL');
  const [filters, setFilters] = useState<OrderFilterState>({
    search: '',
    status: '',
    orderType: '',
    paymentType: '',
  });

  // Assign modal
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, agentsData] = await Promise.all([
        ordersApi.getOrders(),
        agentsApi.getAgents().catch(() => []),
      ]);
      setOrders(ordersData);
      setAgents(agentsData);
    } catch (err) {
      error('Failed to load orders', extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      orderType: '',
      paymentType: '',
    });
    setActiveTab('ALL');
  };

  const handleAssignClick = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsAssignModalOpen(true);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab filter
      if (activeTab === 'UNASSIGNED') {
        if (o.status !== 'CREATED') return false;
      } else if (activeTab === 'IN_TRANSIT') {
        if (!['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)) return false;
      } else if (activeTab === 'DELIVERED') {
        if (o.status !== 'DELIVERED') return false;
      } else if (activeTab === 'EXCEPTIONS') {
        if (!['FAILED', 'RESCHEDULED', 'CANCELLED'].includes(o.status)) return false;
      }

      // Status
      if (filters.status && o.status !== filters.status) return false;

      // Type & Payment
      if (filters.orderType && o.order_type !== filters.orderType) return false;
      if (filters.paymentType && o.payment_type !== filters.paymentType) return false;

      // Search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchTracking = o.tracking_number.toLowerCase().includes(q);
        const matchCustomer = o.customer_name.toLowerCase().includes(q);
        const matchPhone = o.customer_phone.includes(q);
        const matchDelivery = o.delivery_address.toLowerCase().includes(q);
        const matchPincode = o.delivery_pincode.includes(q);
        if (!matchTracking && !matchCustomer && !matchPhone && !matchDelivery && !matchPincode) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, filters]);

  const unassignedCount = orders.filter((o) => o.status === 'CREATED').length;
  const transitCount = orders.filter((o) =>
    ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)
  ).length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const exceptionCount = orders.filter((o) =>
    ['FAILED', 'RESCHEDULED', 'CANCELLED'].includes(o.status)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-600" />
            Admin Order Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Full view of all system consignments, agent assignment status, and route delivery progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Link to="/customer/orders/create">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Create Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'ALL', label: 'All Orders', count: orders.length },
          { id: 'UNASSIGNED', label: 'Unassigned / Needs Agent', count: unassignedCount },
          { id: 'IN_TRANSIT', label: 'In Transit / Delivery', count: transitCount },
          { id: 'DELIVERED', label: 'Delivered', count: deliveredCount },
          { id: 'EXCEPTIONS', label: 'Exceptions', count: exceptionCount },
        ]}
      />

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Orders Table */}
      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        basePath="/admin/orders"
        showAdminActions={true}
        onAssign={handleAssignClick}
      />

      {/* Assign Modal */}
      <AssignOrderModal
        order={selectedOrder}
        availableAgents={agents}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

