import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Candy, Mail, Lock, User, Shield, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const validateRegister = (
  name: string,
  email: string,
  password: string
): string | null => {
  if (!name) return 'Name is required'
  if (!email) return 'Email is required'
  if (!password) return 'Password is required'
  if (password.length < 6)
    return 'Password must be at least 6 characters'
  return null
}

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '', color: 'bg-gray-200' };
    if (pwd.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 10) return { strength: 2, label: 'Medium', color: 'bg-yellow-400' };
    return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    const error = validateRegister(name, email, password)
if (error) {
  showToast(error, 'error')
  return
}

    e.preventDefault();
    setIsLoading(true);

    try {
      await register({ name, email, password, role });
      showToast('Welcome to the club!', 'success');
      navigate(isAdmin ? '/admin' : '/shop');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* --- Background Elements --- */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-10 left-10 text-purple-300 opacity-40 hidden lg:block"
      >
        <Sparkles size={100} strokeWidth={1.5} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 text-pink-300 opacity-40 hidden lg:block"
      >
        <Candy size={120} strokeWidth={1.5} />
      </motion.div>

      {/* --- Register Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl w-full max-w-md border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative z-10"
      >
        {/* Header */}
        <div className="bg-purple-100 border-b-4 border-black p-6 flex items-center gap-5">
          <motion.div 
            whileHover={{ rotate: 20 }}
            className="flex-shrink-0 w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Candy className="w-8 h-8 text-purple-600" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tighter leading-none">
              Join The Club
            </h1>
            <p className="text-gray-700 font-bold text-sm mt-1">Create your sweet profile</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 z-10" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-black rounded-xl text-base font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#A855F7] transition-all placeholder:text-gray-400"
                placeholder="Full Name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 z-10" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-black rounded-xl text-base font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#A855F7] transition-all placeholder:text-gray-400"
                placeholder="Email Address"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 z-10" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-black rounded-xl text-base font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#A855F7] transition-all placeholder:text-gray-400"
                placeholder="Password"
              />
            </div>
            
            {/* Password Strength */}
            {password && (
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 flex gap-1 h-2">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full border border-black/20 ${
                        level <= passwordStrength.strength
                          ? passwordStrength.color
                          : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-black uppercase text-gray-500 w-16 text-right">
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                role === 'customer'
                  ? 'border-black bg-pink-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                  : 'border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black'
              }`}
            >
              <UserRound className={`w-5 h-5 ${role === 'customer' ? 'text-pink-600' : 'currentColor'}`} />
              <span className={`text-sm font-black uppercase ${role === 'customer' ? 'text-black' : 'currentColor'}`}>Customer</span>
            </button>
            
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                role === 'admin'
                  ? 'border-black bg-purple-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                  : 'border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black'
              }`}
            >
              <Shield className={`w-5 h-5 ${role === 'admin' ? 'text-purple-600' : 'currentColor'}`} />
              <span className={`text-sm font-black uppercase ${role === 'admin' ? 'text-black' : 'currentColor'}`}>Admin</span>
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white font-black text-lg uppercase tracking-wide py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#A855F7] hover:shadow-[6px_6px_0px_0px_#A855F7] transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner /> : 'Create Account'}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 border-t-2 border-black p-4 text-center">
          <p className="text-gray-600 font-bold text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-black hover:underline decoration-2 underline-offset-2 transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};