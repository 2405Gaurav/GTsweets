import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Candy, Menu, X, User, Shield, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cart } = useCart(); 
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Calculate total number of items in the cart
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const navLinks = [
    { path: '/', label: 'Home', show: true },
    { path: '/shop', label: 'Shop', show: true },
    { path: '/dashboard', label: 'Dashboard', show: isAuthenticated && !isAdmin },
    { path: '/admin', label: 'Admin', show: isAuthenticated && isAdmin },
  ];

  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-black text-white p-2 rounded-lg border-2 border-transparent group-hover:bg-pink-500 group-hover:border-black transition-colors"
            >
              <Candy className="w-6 h-6" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              Sugar<span className="text-pink-500">Rush</span>
            </span>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center gap-8">
            {/* Links */}
            <div className="flex gap-2">
              {navLinks.map((link) => link.show && (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative"
                >
                  <motion.div
                    className={`px-4 py-2 font-bold uppercase tracking-wide text-sm border-2 rounded-lg transition-all ${
                      isActive(link.path)
                        ? 'bg-yellow-400 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        : 'border-transparent text-gray-600 hover:bg-gray-100 hover:border-black hover:text-black'
                    }`}
                    whileHover={!isActive(link.path) ? { y: -2 } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.label}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 pl-4 border-l-2 border-gray-200">
                
                {/* CART ICON (Customers Only) */}
                {!isAdmin && (
                  <Link to={`/user/${user?.id}/cart`}>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative p-2 bg-white border-2 border-black rounded-full hover:bg-pink-100 transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-6 h-6 text-black" />
                      
                      {/* Badge */}
                      {cartItemCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          key={cartItemCount} // Animate when number changes
                          className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-black h-6 w-6 flex items-center justify-center rounded-full border-2 border-black"
                        >
                          {cartItemCount}
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                )}

                {/* User Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  isAdmin ? 'bg-purple-200' : 'bg-blue-200'
                }`}>
                  {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-bold uppercase opacity-60">
                      {isAdmin ? 'Admin' : 'Hello'}
                    </span>
                    <span className="font-bold text-sm truncate max-w-[100px]">
                      {user?.name}
                    </span>
                  </div>
                </div>

                {/* Logout */}
                <motion.button
                  whileHover={{ y: 2, x: 2, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="p-2 bg-red-500 text-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 font-bold text-black hover:underline"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ y: -2, boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)" }}
                    whileTap={{ scale: 0.95, y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
                    className="px-6 py-2 bg-pink-500 text-white font-black uppercase tracking-wide border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 border-2 border-black rounded-lg hover:bg-gray-100 relative"
          >
            {/* Notification Dot for Mobile */}
            {isAuthenticated && !isAdmin && cartItemCount > 0 && !isMenuOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 border-2 border-white rounded-full animate-pulse" />
            )}
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t-4 border-black bg-[#FFFBF0] overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Mobile Links */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => link.show && (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 font-bold uppercase border-2 rounded-lg ${
                      isActive(link.path)
                        ? 'bg-yellow-400 border-black text-black'
                        : 'bg-white border-transparent hover:border-black'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {isAuthenticated ? (
                <div className="space-y-4 pt-4 border-t-2 border-gray-200">
                  {/* Mobile Cart Button */}
                  {!isAdmin && (
                    <Link
                      to={`/user/${user?.id}/cart`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                    >
                      <span className="font-bold flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" /> My Cart
                      </span>
                      {cartItemCount > 0 && (
                        <span className="bg-pink-500 text-white text-sm font-black px-3 py-1 rounded-full border-2 border-black">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Mobile User Info */}
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-black ${isAdmin ? 'bg-purple-200' : 'bg-blue-200'}`}>
                    {isAdmin ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    <span className="font-bold">{user?.name}</span>
                  </div>

                  {/* Mobile Logout */}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-500 text-white font-black uppercase border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t-2 border-gray-200">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-4 py-3 font-bold border-2 border-black rounded-lg hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-4 py-3 bg-pink-500 text-white font-black uppercase border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};