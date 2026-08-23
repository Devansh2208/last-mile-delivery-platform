import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppShell } from '../components/layout/AppShell';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { RoleGuard } from '../components/layout/RoleGuard';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { CustomerOrdersPage } from '../pages/customer/CustomerOrdersPage';
import { CreateOrderPage } from '../pages/customer/CreateOrderPage';
import { CustomerOrderDetailsPage } from '../pages/customer/CustomerOrderDetailsPage';

// Agent Pages
import { AgentDashboard } from '../pages/agent/AgentDashboard';
import { AgentOrdersPage } from '../pages/agent/AgentOrdersPage';
import { AgentOrderDetailsPage } from '../pages/agent/AgentOrderDetailsPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminOrderDetailsPage } from '../pages/admin/AdminOrderDetailsPage';
import { AdminAgentsPage } from '../pages/admin/AdminAgentsPage';
import { AdminZonesPage } from '../pages/admin/AdminZonesPage';
import { AdminRateCardsPage } from '../pages/admin/AdminRateCardsPage';

// Common Pages
import { PublicTrackingPage } from '../pages/common/PublicTrackingPage';
import { NotFoundPage } from '../pages/common/NotFoundPage';
import { UnauthorizedPage } from '../pages/common/UnauthorizedPage';

const RootRedirect: React.FC = () => {
  const { role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'AGENT') return <Navigate to="/agent/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth Public Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* App Shell Pages */}
      <Route element={<AppShell />}>
        {/* Public / Common in Shell */}
        <Route path="/tracking" element={<PublicTrackingPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Customer Protected Routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['CUSTOMER', 'ADMIN']}>
                <RootRedirect />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['CUSTOMER', 'ADMIN']}>
                <CustomerDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['CUSTOMER', 'ADMIN']}>
                <CustomerOrdersPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders/create"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['CUSTOMER', 'ADMIN']}>
                <CreateOrderPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders/:trackingNumber"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['CUSTOMER', 'ADMIN']}>
                <CustomerOrderDetailsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Agent Protected Routes */}
        <Route
          path="/agent"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['AGENT', 'ADMIN']}>
                <RootRedirect />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['AGENT', 'ADMIN']}>
                <AgentDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/orders"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['AGENT', 'ADMIN']}>
                <AgentOrdersPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/orders/:trackingNumber"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['AGENT', 'ADMIN']}>
                <AgentOrderDetailsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <RootRedirect />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminOrdersPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:trackingNumber"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminOrderDetailsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminAgentsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/zones"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminZonesPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rate-cards"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminRateCardsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch All 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

