import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
      <div className="container mx-auto px-6">
        <nav className={`glass-card !rounded-2xl !p-2 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-white/80' : 'bg-white/40'}`}>
          <div className="flex items-center gap-8 pl-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500">
                <Package size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">PickPack</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="nav-link font-bold">Catalog</Link>
              {user && (
                <Link to="/orders" className="nav-link">My Orders</Link>
              )}
              {user?.role === 'owner' && (
                <Link to="/admin" className="nav-link text-indigo-600">Dashboard</Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <Link to="/cart" className="relative p-3 text-slate-700 hover:text-slate-900 transition-colors">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-1 ml-2">
                <Link to="/profile" className="flex flex-col items-end mr-3 hover:opacity-70 transition-opacity">
                  <span className="text-xs font-bold text-slate-900">{user.full_name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                </Link>
                <div className="w-px h-8 bg-slate-100 mx-2" />
                <Button variant="ghost" onClick={logout} className="!p-2.5 !px-3 !rounded-xl hover:bg-red-50 hover:text-red-600">
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 ml-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="!py-2.5">Join PickPack</Button>
                </Link>
              </div>
            )}

            <button className="md:hidden p-3 text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-6 top-24 z-40"
          >
            <div className="glass-card !p-6 space-y-6">
              <div className="flex flex-col gap-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold">Catalog</Link>
                {user && <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold">My Orders</Link>}
                {user?.role === 'owner' && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-indigo-600">Dashboard</Link>}
              </div>
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Join Now</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold">My Profile</Link>
                    <Button variant="outline" onClick={logout} className="w-full !text-red-600 !border-red-100">Logout</Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-6">
        {children}
      </main>
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
              <Package size={20} />
            </div>
            <span className="text-xl font-bold tracking-tighter">PickPack</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2026 PickPack. Designed for modern retail excellence.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">Terms</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
