import React, { useEffect, useMemo, useState } from 'react';
import { ordersApi } from '../../api/orders';
import { OrderResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { OrderTable } from '../../components/orders/OrderTable';
import { OrderFilters, OrderFilterState } from '../../components/orders/OrderFilters';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { UpdateStatusModal } from '../../components/tracking/UpdateStatusModal';
import { Truck, RefreshCw } from 'lucide-react';

export const AgentOrdersPage: React.FC = () => {
  const { error } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [filters, setFilters] = useState<OrderFilterState>({
    search: '',
    status: '',
    orderType: '',
    paymentType: '',
  });

  // Status update modal
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (err) {
      error('Failed to load assigned orders', extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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

  const handleUpdateStatusClick = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab filter
      if (activeTab === 'ACTIVE') {
        if (!['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)) {
          return false;
        }
      } else if (activeTab === 'PICKUP') {
        if (o.status !== 'ASSIGNED') return false;
      } else if (activeTab === 'DELIVERED') {
        if (o.status !== 'DELIVERED') return false;
      }

      // Status dropdown
      if (filters.status && o.status !== filters.status) return false;

      // Type & Payment
      if (filters.orderType && o.order_type !== filters.orderType) return false;
      if (filters.paymentType && o.payment_type !== filters.paymentType) return false;

      // Search query
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

  const activeCount = orders.filter((o) =>
    ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)
  ).length;
  const pickupCount = orders.filter((o) => o.status === 'ASSIGNED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-brand-600" />
            Agent Assigned Deliveries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pick up packages, transition statuses along the transit route, and complete final customer delivery.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Deliveries
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'ACTIVE', label: 'In-Transit Queue', count: activeCount },
          { id: 'PICKUP', label: 'Pending Pickup', count: pickupCount },
          { id: 'DELIVERED', label: 'Completed Deliveries', count: deliveredCount },
          { id: 'ALL', label: 'All Registered Orders', count: orders.length },
        ]}
      />

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        basePath="/agent/orders"
        showAgentActions={true}
        onUpdateStatus={handleUpdateStatusClick}
      />

      {/* Update Modal */}
      <UpdateStatusModal
        order={selectedOrder}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={fetchOrders}
      />
    </div>
  );
};

