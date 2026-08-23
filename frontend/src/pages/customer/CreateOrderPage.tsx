import React from 'react';
import { CreateOrderForm } from '../../components/orders/CreateOrderForm';
import { PackagePlus } from 'lucide-react';

export const CreateOrderPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <PackagePlus className="w-6 h-6 text-brand-600" />
          Create New Delivery Order
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide package dimensions, pickup hub, and recipient destination to generate a tracking
          number.
        </p>
      </div>

      <CreateOrderForm onSuccessPath="/customer/orders" />
    </div>
  );
};

