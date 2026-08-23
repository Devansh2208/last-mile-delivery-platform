import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderResponse } from '../../types';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatWeight, formatDate } from '../../utils/formatters';
import { ArrowRight, Phone } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { TableSkeleton } from '../ui/Skeleton';

export interface OrderTableProps {
  orders: OrderResponse[];
  isLoading?: boolean;
  basePath?: string; // '/customer/orders', '/agent/orders', '/admin/orders'
  onAssign?: (order: OrderResponse) => void;
  onUpdateStatus?: (order: OrderResponse) => void;
  showAdminActions?: boolean;
  showAgentActions?: boolean;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  isLoading = false,
  basePath = '/customer/orders',
  onAssign,
  onUpdateStatus,
  showAdminActions = false,
  showAgentActions = false,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No Orders Found"
        description="There are no delivery orders matching your current filters or in this queue."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Tracking #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Route & Pincode</th>
                <th className="py-3.5 px-4">Weight & Dimensions</th>
                <th className="py-3.5 px-4">Type & Pricing</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`${basePath}/${order.tracking_number}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  {/* Tracking Number */}
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">
                    <span className="text-brand-600 group-hover:underline">
                      {order.tracking_number}
                    </span>
                    {order.created_at && (
                      <span className="block font-sans text-[10px] text-slate-400 font-normal mt-0.5">
                        {formatDate(order.created_at)}
                      </span>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900">{order.customer_name}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{order.customer_phone}</span>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="py-4 px-4">
                    <div className="max-w-[200px] truncate text-slate-800" title={order.delivery_address}>
                      To: {order.delivery_address}
                    </div>
                    <div className="text-[11px] font-mono font-medium text-slate-500 mt-0.5">
                      PIN: <span className="text-slate-700 font-bold">{order.delivery_pincode}</span>
                    </div>
                  </td>

                  {/* Weight */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-900">
                      {formatWeight(order.package_weight)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Billable: <span className="font-semibold text-slate-700">{order.billable_weight} kg</span>
                    </div>
                  </td>

                  {/* Pricing & Type */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">
                      {formatCurrency(order.calculated_charge)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] uppercase font-bold text-slate-500">
                      <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">{order.order_type}</span>
                      <span className={`px-1.5 py-0.2 rounded ${order.payment_type === 'COD' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {order.payment_type}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <Badge status={order.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {showAdminActions && order.status === 'CREATED' && onAssign && (
                        <button
                          onClick={() => onAssign(order)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          Assign Agent
                        </button>
                      )}

                      {showAgentActions && onUpdateStatus && (
                        <button
                          onClick={() => onUpdateStatus(order)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Update Status
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`${basePath}/${order.tracking_number}`)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="View Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile / Tablet Responsive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`${basePath}/${order.tracking_number}`)}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono font-bold text-xs text-brand-600">
                  {order.tracking_number}
                </span>
                <Badge status={order.status} size="sm" />
              </div>

              <div className="text-sm font-bold text-slate-900">{order.customer_name}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                {order.customer_phone}
              </div>

              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                <div className="truncate">
                  <span className="font-semibold text-slate-700">Delivery:</span> {order.delivery_address}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Pincode:</span> {order.delivery_pincode}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span>Weight: {formatWeight(order.package_weight)}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(order.calculated_charge)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-400">
                {order.order_type} • {order.payment_type}
              </span>
              <span className="font-semibold text-brand-600 flex items-center gap-1">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

