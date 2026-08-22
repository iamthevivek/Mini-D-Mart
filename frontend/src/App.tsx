import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import CustomerReturnsPage from './pages/CustomerReturnsPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'MANAGER') return <Navigate to="/manager" replace />;
    if (user.role === 'STAFF') return <Navigate to="/staff" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const RootLandingRoute: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'MANAGER') return <Navigate to="/manager" replace />;
    if (user.role === 'STAFF') return <Navigate to="/staff" replace />;
  }

  return <HomePage searchQuery={searchQuery} />;
};

const AuthGuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'MANAGER') return <Navigate to="/manager" replace />;
    if (user.role === 'STAFF') return <Navigate to="/staff" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isCheckoutOpen, setIsCheckoutOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<RootLandingRoute searchQuery={searchQuery} />} />

          <Route
            path="/login"
            element={
              <AuthGuestRoute>
                <LoginPage />
              </AuthGuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthGuestRoute>
                <RegisterPage />
              </AuthGuestRoute>
            }
          />

          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/returns"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerReturnsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'MANAGER', 'ADMIN']}>
                <StaffDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                <ManagerDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />

      <CartDrawer />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
