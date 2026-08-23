import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { extractErrorMessage } from '../../api/client';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Truck, UserPlus, Lock, Mail, User, Phone } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      error('Password Mismatch', 'The passwords you entered do not match.');
      return;
    }

    if (formData.password.length < 6) {
      error('Weak Password', 'Password should be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        password: formData.password,
      });

      success('Account Created!', 'Logging you in automatically...');

      // Auto login after register
      try {
        const { role } = await login({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (role === 'CUSTOMER') {
          navigate('/customer/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      error('Registration Failed', extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 relative overflow-hidden">
      {/* Ambient background */}
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
        <h2 className="text-xl font-bold text-slate-100">Create Customer Account</h2>
        <p className="mt-1 text-xs text-slate-400">
          Access your personal logistics dashboard and track deliveries
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-200/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              required
              leftIcon={<User className="w-4 h-4" />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="e.g. 9876543210"
              leftIcon={<Phone className="w-4 h-4" />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Password"
              isPassword
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Input
              label="Confirm Password"
              isPassword
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

