import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PackageX, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-brand-50 rounded-3xl border border-brand-100 text-brand-600 mb-4">
        <PackageX className="w-12 h-12" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-brand-600">404 Error</span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2">
        The destination or consignment page you are looking for does not exist or has been relocated.
      </p>

      <Link to="/" className="mt-6">
        <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

