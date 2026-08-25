import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  // If user is Staff, Manager or Admin on their dashboard routes, show simplified bottom navigation
  if (user && user.role !== 'CUSTOMER') {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1.5 px-3 shadow-lg pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            isActive('/') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Shop</span>
        </Link>

        {user && user.role === 'CUSTOMER' && (
          <Link
            to="/wishlist"
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition relative ${
              isActive('/wishlist') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-1.5 bg-rose-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
            <span className="text-[10px] mt-0.5">Wishlist</span>
          </Link>
        )}

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center py-1 px-2.5 rounded-xl text-slate-500 dark:text-slate-400 relative"
          aria-label="Open Shopping Cart"
        >
          <div className="p-1.5 -mt-3 rounded-full bg-emerald-600 text-white shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-3.5 right-1.5 bg-amber-500 text-emerald-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">Cart</span>
        </button>

        <Link
          to={user ? '/customer/orders' : '/login'}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            isActive('/customer/orders') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Orders</span>
        </Link>

        <Link
          to={user ? '/profile' : '/login'}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            isActive('/profile') || isActive('/login')
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{user ? 'Account' : 'Sign In'}</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
