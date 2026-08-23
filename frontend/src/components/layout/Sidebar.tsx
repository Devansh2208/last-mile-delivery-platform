import React from 'react';
import { NavLink } from 'react-router-dom';
import { CreditCard, LayoutDashboard, MapPin, Package, Truck, Users } from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole | null;
}

const linksByRole = {
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/orders', label: 'Orders', icon: Package },
    { to: '/admin/agents', label: 'Agents', icon: Users },
    { to: '/admin/zones', label: 'Zones', icon: MapPin },
    { to: '/admin/rate-cards', label: 'Rate Cards', icon: CreditCard },
  ],
  AGENT: [
    { to: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/agent/orders', label: 'Orders', icon: Truck },
  ],
  CUSTOMER: [
    { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customer/orders', label: 'My Orders', icon: Package },
    { to: '/customer/orders/create', label: 'Create Order', icon: Truck },
  ],
} satisfies Record<UserRole, { to: string; label: string; icon: React.ElementType }[]>;

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const links = role ? linksByRole[role] : [];

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-slate-200 bg-white">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200">
        <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <p className="font-extrabold text-slate-900 leading-tight">LastMile</p>
          <p className="text-[11px] text-slate-500 font-semibold">Delivery Ops</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavLink
          to="/tracking"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <MapPin className="w-4 h-4" />
          Public Tracking
        </NavLink>

        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
