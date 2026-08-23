import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export interface OrderFilterState {
  search: string;
  status: string;
  orderType: string;
  paymentType: string;
}

export interface OrderFiltersProps {
  filters: OrderFilterState;
  onChange: (filters: OrderFilterState) => void;
  onReset: () => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ filters, onChange, onReset }) => {
  const isFiltered =
    filters.search || filters.status || filters.orderType || filters.paymentType;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search tracking #, customer, phone, address..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="CREATED">Created</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FAILED">Failed</option>
            <option value="RESCHEDULED">Rescheduled</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Order Type Filter */}
        <div>
          <select
            value={filters.orderType}
            onChange={(e) => onChange({ ...filters, orderType: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white text-slate-700"
          >
            <option value="">All Types (B2B/B2C)</option>
            <option value="B2B">B2B (Business)</option>
            <option value="B2C">B2C (Consumer)</option>
          </select>
        </div>

        {/* Reset / Actions */}
        <div className="flex items-center gap-2">
          <select
            value={filters.paymentType}
            onChange={(e) => onChange({ ...filters, paymentType: e.target.value })}
            className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white text-slate-700"
          >
            <option value="">All Payment</option>
            <option value="PREPAID">Prepaid</option>
            <option value="COD">COD</option>
          </select>

          {isFiltered && (
            <button
              onClick={onReset}
              title="Reset Filters"
              className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

