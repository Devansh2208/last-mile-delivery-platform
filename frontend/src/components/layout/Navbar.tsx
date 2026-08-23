import React from 'react';
import { LogOut, Menu, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, role, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm font-bold text-slate-900">Operations Workspace</p>
        <p className="text-xs text-slate-500">Manage orders, fleet, pricing, and tracking</p>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {user ? (
          <div className="flex items-center gap-2 text-right">
            <UserCircle className="w-8 h-8 text-slate-400" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] font-semibold text-slate-500">{role}</p>
            </div>
          </div>
        ) : (
          <span className="text-xs font-semibold text-slate-500">Guest</span>
        )}

        {user && (
          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
