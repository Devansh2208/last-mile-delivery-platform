import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const { role, isAuthenticated } = useAuth();

  const getHomePath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'AGENT') return '/agent/dashboard';
    if (role === 'CUSTOMER') return '/customer/dashboard';
    return '/login';
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-rose-50 rounded-3xl border border-rose-100 text-rose-600 mb-4">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-rose-600">403 Forbidden</span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Access Restricted</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2">
        You don't have permission to access this administrative portal or resource with your current
        account role ({role || 'Guest'}).
      </p>

      <div className="flex items-center gap-3 mt-6">
        <Link to={getHomePath()}>
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Go to Your Dashboard
          </Button>
        </Link>
        {!isAuthenticated && (
          <Link to="/login">
            <Button variant="outline" leftIcon={<LogIn className="w-4 h-4" />}>
              Sign In with Another Account
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

