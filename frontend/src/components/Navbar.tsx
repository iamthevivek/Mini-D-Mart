import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User as UserIcon,
  Store,
  Shield,
  LogOut,
  ChevronDown,
  Package,
  RotateCcw,
  LayoutDashboard,
  Search,
  Heart,
  Sun,
  Moon,
  Laptop,
  Clock,
  Truck,
  PhoneCall,
  Sparkles,
  Layers,
  X,
  History,
  TrendingUp,
  Apple,
  Milk,
  Wheat,
  Coffee,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import api from '../api/client';
import { Product, Category } from '../types';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onSelectCategory?: (id: number | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchQuery = '', onSearchChange, onSelectCategory }) => {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen, cart } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quickSearchResults, setQuickSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('minidmart_recent_searches');
      return saved ? JSON.parse(saved) : ['Alphonso Mango', 'Amul Milk', 'Basmati Rice', 'Organic Dal'];
    } catch {
      return [];
    }
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Global keyboard shortcut (Ctrl+K or ⌘K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get<Category[]>('/categories');
      setCategories(res.data);
    } catch {}
  };

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const fetchQuickSearch = async () => {
        try {
          const res = await api.get<Product[]>(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
          setQuickSearchResults(res.data.slice(0, 5));
        } catch {
          setQuickSearchResults([]);
        }
      };
      const debounceTimer = setTimeout(fetchQuickSearch, 200);
      return () => clearTimeout(debounceTimer);
    } else {
      setQuickSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (term: string) => {
    if (!term.trim()) return;
    if (onSearchChange) {
      onSearchChange(term);
    }
    const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('minidmart_recent_searches', JSON.stringify(updated));
    } catch {}
    setIsSearchFocused(false);

    if (window.location.pathname !== '/') {
      navigate('/');
    }

    setTimeout(() => {
      const elem = document.getElementById('catalog-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
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
      ADMIN: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      MANAGER: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      STAFF: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      CUSTOMER: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    };
    return (
      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${colors[user.role] || 'bg-slate-100 text-slate-800'}`}>
        {user.role}
      </span>
    );
  };

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('fruit') || n.includes('veg')) return <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    if (n.includes('dairy') || n.includes('bake')) return <Milk className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    if (n.includes('staple') || n.includes('grain')) return <Wheat className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    if (n.includes('snack') || n.includes('bev')) return <Coffee className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    return <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
  };

  const isCustomerOrGuest = !user || user.role === 'CUSTOMER';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2.5 truncate">
            <span className="bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded text-[9px] tracking-wider uppercase shrink-0 shadow-xs">
              ⚡ FREE DELIVERY
            </span>
            <span className="truncate text-[10px] sm:text-xs text-emerald-50">
              Orders ₹500+ qualify for zero delivery fee • Express 15-min Store Pickup Available
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-[11px] text-emerald-100">
            <span className="flex items-center gap-1.5 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open: 8 AM – 10 PM</span>
            </span>
            <span className="flex items-center gap-1 hover:text-amber-300 transition">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Support: +91 8000-ONEMART</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link to={getHomeLink()} className="flex items-center space-x-3 flex-shrink-0 group" title="OneMart Supermarket">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline leading-none">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">One</span>
                <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">Mart</span>
              </div>
              <span className="block text-[9px] text-emerald-700 dark:text-emerald-400 tracking-wider font-extrabold uppercase mt-0.5">
                SUPERMARKET & GROCERY
              </span>
            </div>
          </Link>

          {/* Categories Dropdown Menu (Desktop) */}
          {isCustomerOrGuest && categories.length > 0 && (
            <div ref={categoryMenuRef} className="relative hidden lg:block">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition shadow-2xs"
              >
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-scale-in">
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(null);
                      setIsCategoryMenuOpen(false);
                      if (window.location.pathname !== '/') navigate('/');
                      setTimeout(() => {
                        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 80);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 flex items-center justify-between"
                  >
                    <span>All Departments</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">View All</span>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(c.id);
                        setIsCategoryMenuOpen(false);
                        if (window.location.pathname !== '/') navigate('/');
                        setTimeout(() => {
                          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 80);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center space-x-2.5"
                    >
                      {getCategoryIcon(c.name)}
                      <span className="font-semibold">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search Autocomplete Bar (Desktop) */}
          {onSearchChange && isCustomerOrGuest && (
            <div ref={searchContainerRef} className="flex-1 max-w-xl relative hidden md:block">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search fresh vegetables, dairy, staples, snacks & household..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSubmit(searchQuery);
                  }}
                  className="w-full pl-10 pr-16 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 transition shadow-2xs placeholder-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                {/* Keyboard Shortcut badge or Clear button */}
                <div className="absolute right-3.5 top-2.5 flex items-center space-x-1">
                  {searchQuery ? (
                    <button
                      onClick={() => onSearchChange('')}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700 rounded">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-slide-up space-y-4">
                  {quickSearchResults.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Matching Products</span>
                      </p>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {quickSearchResults.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => handleSearchSubmit(prod.name)}
                            className="py-2.5 px-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-2xl cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                {prod.imageUrl ? (
                                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain" />
                                ) : (
                                  <Store className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{prod.name}</p>
                                <p className="text-[10px] text-slate-400">{prod.unit} • {prod.category?.name || 'Grocery'}</p>
                              </div>
                            </div>
                            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 shrink-0 ml-2">
                              ₹{prod.sellingPrice.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        <span className="flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-slate-400" />
                          <span>Recent Searches</span>
                        </span>
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem('minidmart_recent_searches');
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-500 font-semibold"
                        >
                          Clear History
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearchSubmit(term)}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 text-xs rounded-full transition flex items-center gap-1.5 font-medium"
                          >
                            <TrendingUp className="w-3 h-3 text-slate-400" />
                            <span>{term}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Action Icons & User Account Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
            {/* Theme Toggle Button & Dropdown */}
            <div ref={themeMenuRef} className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Toggle Theme"
                aria-label="Select Theme Mode"
              >
                {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-scale-in text-xs">
                  <button
                    onClick={() => {
                      setTheme('light');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 ${
                      theme === 'light' ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 ${
                      theme === 'dark' ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('system');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 ${
                      theme === 'system' ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>System Mode</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Link (Desktop) - Visible ONLY when user is logged in as Customer */}
            {user && user.role === 'CUSTOMER' && (
              <Link
                to="/wishlist"
                className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Saved Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Role Portal Shortcuts */}
            {user && user.role === 'STAFF' && (
              <Link
                to="/staff"
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 font-bold text-xs border border-amber-200 dark:border-amber-800 transition"
              >
                <Package className="w-4 h-4" />
                <span>Staff Operations</span>
              </Link>
            )}

            {user && user.role === 'MANAGER' && (
              <Link
                to="/manager"
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 hover:bg-blue-100 font-bold text-xs border border-blue-200 dark:border-blue-800 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Manager Console</span>
              </Link>
            )}

            {user && user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs border border-purple-200 dark:border-purple-800 transition"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}

            {/* Shopping Cart Pill Button with Count & Subtotal */}
            {isCustomerOrGuest && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md active:scale-95"
                title="View Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-emerald-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </div>
                {cart && cart.totalAmount > 0 && (
                  <span className="hidden sm:inline-block text-xs font-black pl-1 border-l border-emerald-500/60">
                    ₹{cart.totalAmount.toFixed(2)}
                  </span>
                )}
              </button>
            )}

            {/* User Account Menu */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left pr-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-scale-in">
                    <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">{user.email}</p>
                      <div className="mt-1.5">{getRoleBadge()}</div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      {user.role === 'CUSTOMER' && (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition"
                          >
                            <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>My Profile & Addresses</span>
                          </Link>
                          <Link
                            to="/customer/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition"
                          >
                            <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>My Orders & Live Tracking</span>
                          </Link>
                          <Link
                            to="/customer/returns"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition"
                          >
                            <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Returns & Exchanges</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition"
                          >
                            <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>My Wishlist ({wishlistCount})</span>
                          </Link>
                        </>
                      )}

                      {user.role === 'STAFF' && (
                        <Link
                          to="/staff"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-800 rounded-xl"
                        >
                          <Package className="w-4 h-4" />
                          <span>Staff Operations Portal</span>
                        </Link>
                      )}

                      {user.role === 'MANAGER' && (
                        <Link
                          to="/manager"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-800 rounded-xl"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Manager Control Center</span>
                        </Link>
                      )}

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-800 rounded-xl"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Security Console</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-2xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {onSearchChange && isCustomerOrGuest && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search fresh vegetables, dairy, staples..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit(searchQuery);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
