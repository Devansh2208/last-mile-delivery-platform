import { OrderStatus } from '../types';

export interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  description: string;
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  CREATED: {
    label: 'Created',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    dot: 'bg-slate-400',
    description: 'Order details registered and awaiting assignment',
  },
  ASSIGNED: {
    label: 'Assigned',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    description: 'Delivery agent assigned to pick up the package',
  },
  PICKED_UP: {
    label: 'Picked Up',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    description: 'Package picked up from origin location',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    description: 'Package is moving through the delivery hub network',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    description: 'Package is on the vehicle for final delivery today',
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    description: 'Package has been successfully handed over to recipient',
  },
  FAILED: {
    label: 'Failed Delivery',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    description: 'Delivery attempt failed due to customer unavailable or incorrect address',
  },
  RESCHEDULED: {
    label: 'Rescheduled',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
    description: 'Delivery has been rescheduled for another date/time',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    description: 'Order was cancelled and processing halted',
  },
};

export const STANDARD_TIMELINE_STEPS: OrderStatus[] = [
  'CREATED',
  'ASSIGNED',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export function getStatusIndex(status: OrderStatus): number {
  return STANDARD_TIMELINE_STEPS.indexOf(status);
}

export function getAllowedNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  switch (currentStatus) {
    case 'CREATED':
      return ['ASSIGNED', 'CANCELLED'];
    case 'ASSIGNED':
      return ['PICKED_UP', 'CANCELLED'];
    case 'PICKED_UP':
      return ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED', 'CANCELLED'];
    case 'IN_TRANSIT':
      return ['OUT_FOR_DELIVERY', 'FAILED', 'RESCHEDULED', 'CANCELLED'];
    case 'OUT_FOR_DELIVERY':
      return ['DELIVERED', 'FAILED', 'RESCHEDULED'];
    case 'FAILED':
      return ['RESCHEDULED', 'OUT_FOR_DELIVERY', 'CANCELLED'];
    case 'RESCHEDULED':
      return ['OUT_FOR_DELIVERY', 'IN_TRANSIT', 'CANCELLED'];
    case 'DELIVERED':
    case 'CANCELLED':
      return [];
    default:
      return ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RESCHEDULED'];
  }
}

