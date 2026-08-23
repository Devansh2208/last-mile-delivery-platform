import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { OrderResponse } from '../../types';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { OrderTable } from '../../components/orders/OrderTable';
import { OrderFilters, OrderFilterState } from '../../components/orders/OrderFilters';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Package, PlusCircle, RefreshCw } from 'lucide-react';

export const CustomerOrdersPage: React.FC = () => {
  const { error } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('ALL');
  const [filters, setFilters] = useState<OrderFilterState>({
    search: '',
    status: '',
    orderType: '',
    paymentType: '',
  });

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

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      orderType: '',
      paymentType: '',
    });
    setActiveTab('ALL');
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab filter
      if (activeTab === 'ACTIVE') {
        if (!['CREATED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)) {
          return false;
        }
      } else if (activeTab === 'DELIVERED') {
        if (o.status !== 'DELIVERED') return false;
      } else if (activeTab === 'EXCEPTIONS') {
        if (!['FAILED', 'RESCHEDULED', 'CANCELLED'].includes(o.status)) return false;
      }

      // Dropdown status filter
      if (filters.status && o.status !== filters.status) return false;

      // Order type
      if (filters.orderType && o.order_type !== filters.orderType) return false;

      // Payment type
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
    ['CREATED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)
  ).length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const exceptionCount = orders.filter((o) =>
    ['FAILED', 'RESCHEDULED', 'CANCELLED'].includes(o.status)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-600" />
            My Delivery Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, filter, and track all your delivery orders and consignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
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
              New Order
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
          { id: 'ACTIVE', label: 'In Progress', count: activeCount },
          { id: 'DELIVERED', label: 'Delivered', count: deliveredCount },
          { id: 'EXCEPTIONS', label: 'Exceptions / Failed', count: exceptionCount },
        ]}
      />

      {/* Filters Bar */}
      <OrderFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        basePath="/customer/orders"
      />
    </div>
  );
};

