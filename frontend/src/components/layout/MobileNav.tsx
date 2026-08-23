import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CreditCard, LayoutDashboard, MapPin, Package, Truck, Users, X } from 'lucide-react';
import { UserRole } from '../../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
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

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, role }) => {
  if (!isOpen) return null;

  const links = role ? linksByRole[role] : [];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation backdrop"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
      />
      <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl">
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <Link to="/" onClick={onClose} className="font-extrabold text-slate-900">
            LastMile
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1" onClick={onClose}>
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
      </div>
    </div>
  );
};
