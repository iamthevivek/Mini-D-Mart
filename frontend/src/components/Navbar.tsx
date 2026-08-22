import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Store, Shield, LogOut, ChevronDown, Package, RotateCcw, LayoutDashboard, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange }) => {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'MANAGER') return '/manager';
    if (user.role === 'STAFF') return '/staff';
    return '/';
  };

  const getRoleBadge = () => {
    if (!user) return null;
    const colors: Record<string, string> = {
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-300',
      MANAGER: 'bg-blue-100 text-blue-800 border-blue-300',
      STAFF: 'bg-amber-100 text-amber-800 border-amber-300',
      CUSTOMER: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
    return (
      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${colors[user.role] || 'bg-gray-100 text-gray-800'}`}>
        {user.role}
      </span>
    );
  };

  const isCustomerOrGuest = !user || user.role === 'CUSTOMER';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="bg-emerald-800 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-1.5 sm:space-x-2 truncate">
            <span className="bg-yellow-400 text-emerald-950 font-black px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wider uppercase shrink-0">
              Free Delivery
            </span>
            <span className="truncate text-[10px] sm:text-xs">On orders ₹500+ | Express Store Pickup Available</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-[11px] text-emerald-200">
            <span>Customer Care: +91 8000-DMART</span>
            <span>•</span>
            <span>Store Hub: Open Daily 8 AM – 10 PM</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          <Link to={getHomeLink()} className="flex items-center space-x-2 flex-shrink-0 group" title="Mini D-Mart Home">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:bg-emerald-700 transition">
              <Store className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-700">Mini</span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-yellow-500">D-Mart</span>
              <span className="block text-[8px] sm:text-[10px] text-gray-500 tracking-wider font-bold">GROCERY & FRESH MART</span>
            </div>
          </Link>

          {onSearchChange && isCustomerOrGuest && (
            <div className="flex-1 max-w-xl relative hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fresh items, dairy, staples, snacks & household..."
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 sm:space-x-2.5 ml-auto">
            {user && user.role === 'STAFF' && (
              <Link
                to="/staff"
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-xs border border-amber-200 transition"
              >
                <Package className="w-4 h-4" />
                <span>Staff Operations</span>
              </Link>
            )}

            {user && user.role === 'MANAGER' && (
              <Link
                to="/manager"
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold text-xs border border-blue-200 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Manager Console</span>
              </Link>
            )}

            {user && user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100 font-semibold text-xs border border-purple-200 transition"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}

            {isCustomerOrGuest && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition shadow-xs"
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-emerald-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition border border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left pr-1">
                    <p className="text-xs font-bold text-gray-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="mt-1.5">{getRoleBadge()}</div>
                    </div>

                    {user.role === 'CUSTOMER' && (
                      <>
                        <Link
                          to="/customer/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders & Tracking</span>
                        </Link>
                        <Link
                          to="/customer/returns"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Returns & Exchanges</span>
                        </Link>
                      </>
                    )}

                    {user.role === 'STAFF' && (
                      <Link
                        to="/staff"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <Package className="w-4 h-4" />
                        <span>Staff Operations</span>
                      </Link>
                    )}

                    {user.role === 'MANAGER' && (
                      <Link
                        to="/manager"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Manager Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-800"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {onSearchChange && isCustomerOrGuest && (
          <div className="pb-2.5 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search fresh items, staples, dairy..."
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
