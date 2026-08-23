import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { extractErrorMessage } from '../../api/client';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Truck, LogIn, Lock, Mail, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      error('Validation Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const { role } = await login({ email: email.trim(), password });
      success('Welcome back!', `Logged in as ${role}`);

      if (from) {
        navigate(from, { replace: true });
      } else {
        if (role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
        else if (role === 'AGENT') navigate('/agent/dashboard', { replace: true });
        else navigate('/customer/dashboard', { replace: true });
      }
    } catch (err) {
      error('Login Failed', extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 group-hover:bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 transition-all">
            <Truck className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Last<span className="text-brand-400">Mile</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-100">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-400">
          Last-Mile Delivery & Operations Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-200/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              isPassword
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Fill Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('customer@example.com')}
                className="p-2 text-[11px] font-semibold bg-slate-50 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-slate-200 rounded-xl text-slate-700 transition-colors text-center"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('agent@example.com')}
                className="p-2 text-[11px] font-semibold bg-slate-50 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 border border-slate-200 rounded-xl text-slate-700 transition-colors text-center"
              >
                Agent
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@example.com')}
                className="p-2 text-[11px] font-semibold bg-slate-50 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200 border border-slate-200 rounded-xl text-slate-700 transition-colors text-center"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </div>
        </div>

        {/* Public Tracking Link */}
        <div className="mt-4 text-center">
          <Link
            to="/tracking"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Looking to track a delivery? Click here for public tracking →
          </Link>
        </div>
      </div>
    </div>
  );
};

