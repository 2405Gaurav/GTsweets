import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Candy, Mail, Lock, LogIn, ArrowRight, Cookie } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      showToast('Welcome back, sugar!', 'success');
      navigate(isAdmin ? '/admin' : '/shop');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* --- Background Decorations --- */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 text-pink-300 opacity-40 pointer-events-none hidden lg:block"
      >
        <Candy size={120} strokeWidth={1.5} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 text-yellow-300 opacity-40 pointer-events-none hidden lg:block"
      >
        <Cookie size={120} strokeWidth={1.5} />
      </motion.div>

      {/* --- Login Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden relative z-10"
      >
        {/* Header - Matching Register Style */}
        <div className="bg-pink-100 border-b-4 border-black p-6 flex items-center gap-5">
          <motion.div 
            whileHover={{ rotate: -20 }}
            className="flex-shrink-0 w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Candy className="w-8 h-8 text-pink-600" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tighter leading-none">
              Welcome Back
            </h1>
            <p className="text-gray-700 font-bold text-sm mt-1">Ready for a sugar rush?</p>
          </div>
        </div>

        {/* Card Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Email Field */}
          <div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 z-10" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-black rounded-xl text-base font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#EC4899] transition-all placeholder:text-gray-400"
                placeholder="Email Address"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 z-10" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-black rounded-xl text-base font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#EC4899] transition-all placeholder:text-gray-400"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Remember Me & Forgot PW */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 border-black rounded flex items-center justify-center transition-colors ${rememberMe ? 'bg-black' : 'bg-white'}`}>
                  {rememberMe && <ArrowRight className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="ml-2 text-sm font-bold text-gray-600 group-hover:text-black transition-colors">
                Remember me
              </span>
            </label>
            
            <a href="#" className="text-sm font-bold text-pink-600 hover:text-black underline decoration-2 decoration-pink-300 hover:decoration-black underline-offset-2 transition-all">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-yellow-400 text-black font-black text-lg uppercase tracking-wide py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="scale-75"><LoadingSpinner /></div>
            ) : (
              <>
                LOGIN NOW <LogIn className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 border-t-2 border-black p-4 text-center">
          <p className="text-gray-600 font-bold text-sm">
            New to SweetShop?{' '}
            <Link to="/register" className="text-pink-600 hover:text-black hover:underline decoration-2 underline-offset-2 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};