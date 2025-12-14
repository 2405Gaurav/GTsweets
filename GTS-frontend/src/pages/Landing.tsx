import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Candy, 
  ShoppingBag, 
  Star, 
  Zap, 
  ArrowRight, 
  Gift, 
  TrendingUp 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Helper component for the infinite marquee
const Marquee = ({ text }: { text: string }) => (
  <div className="overflow-hidden bg-yellow-400 border-y-4 border-black py-3 relative z-10">
    <motion.div
      animate={{ x: [0, -1000] }}
      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      className="whitespace-nowrap flex gap-8 font-black text-2xl uppercase tracking-wider text-black"
    >
      {[...Array(10)].map((_, i) => (
        <span key={i} className="flex items-center gap-4">
          {text} <Star className="fill-black w-6 h-6" />
        </span>
      ))}
    </motion.div>
  </div>
);

export const Landing = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { scrollYProgress } = useScroll();
  
  // Parallax effect for the hero shapes
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-gray-900 overflow-x-hidden font-sans selection:bg-pink-500 selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20 overflow-hidden">
        {/* Abstract Background Blobs */}
        <motion.div style={{ y: y2 }} className="absolute top-20 right-[10%] text-pink-500 opacity-20 hidden lg:block">
          <Candy size={300} strokeWidth={1} />
        </motion.div>
        <motion.div style={{ y: y1 }} className="absolute bottom-20 left-[5%] text-purple-500 opacity-20 hidden lg:block">
          <Gift size={250} strokeWidth={1} />
        </motion.div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Text Content - Shifted Right and Up */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:pl-16 lg:-mt-24" 
          >
            <div className="inline-block px-4 py-1 bg-black text-white rounded-full font-bold text-sm mb-6 shadow-[4px_4px_0px_0px_rgba(255,100,200,1)]">
              🚀 The #1 Sweet Shop in Town
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] mb-8 tracking-tight">
              SUGAR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                RUSH
              </span>
              <span className="inline-block ml-4 text-pink-500 rotate-12">
                <Candy size={80} strokeWidth={2.5} />
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 font-medium max-w-lg leading-relaxed">
              Unlock a world of premium confectionary. From sour gummies to artisan chocolates, we deliver happiness in a box.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5, y: 5, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-pink-500 text-white text-lg font-black uppercase tracking-wide border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-xl flex items-center justify-center gap-3"
                >
                  Start Shopping <ShoppingBag />
                </motion.button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-black text-lg font-black uppercase tracking-wide border-2 border-black shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] transition-all rounded-xl"
                  >
                    Join the Club
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Hero Visual - Floating Cards */}
          <div className="relative h-125 hidden lg:block">
            <motion.div
              animate={{ y: [10, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 z-20"
            >
              <Link to="/shop">
                <div className="bg-white p-7 rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_#A855F7] w-72 rotate-6 cursor-pointer hover:scale-105 transition-transform">
                  <div className="bg-purple-100 h-36 rounded-xl mb-4 overflow-hidden">
                    <img 
                      src="/assets/gulab.png" 
                      alt="Gulab Jamun" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-bold text-xl">Gulab Jamun</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Syrup-based</span>
                    <span className="font-black">₹120</span>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              animate={{ y: [0, 25, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-40 left-10 z-10"
            >
              <Link to="/shop">
                <div className="bg-white p-7 rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_#EC4899] w-72 -rotate-6 cursor-pointer hover:scale-105 transition-transform">
                  <div className="bg-pink-100 h-36 rounded-xl mb-4 overflow-hidden">
                    <img 
                      src="/assets/laddu.png" 
                      alt="Besan Ladoo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-bold text-xl">Besan Ladoo</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Traditional</span>
                    <span className="font-black">₹80</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Marquee text="FRESH STOCK • FAST SHIPPING • TASTY TREATS •" />

      {/* --- BENTO GRID FEATURES --- */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 text-black">
              Why Choose <span className="text-pink-600 underline decoration-wavy">Us?</span>
            </h2>
            <p className="text-gray-500 text-xl font-medium">We take snacking seriously.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Feature 1 - Trending Flavors (LINKED) */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 bg-blue-50 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_#000] relative overflow-hidden group cursor-pointer"
            >
              <Link to="/shop" className="block p-10 h-full w-full">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="bg-blue-500 w-14 h-14 rounded-full flex items-center justify-center border-2 border-black mb-6">
                      <TrendingUp className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors">Trending Flavors</h3>
                    <p className="text-gray-700 text-lg">We scour the globe to find the viral sweets everyone is talking about. From TikTok famous gummies to Japanese exclusives.</p>
                  </div>
                  <div className="mt-8 self-end flex items-center gap-2 font-bold text-blue-500">
                    SHOP NOW 
                    <ArrowRight className="w-10 h-10 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Feature 2 - Vertical */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bg-yellow-50 rounded-3xl p-10 border-2 border-black shadow-[8px_8px_0px_0px_#000]"
            >
              <div className="bg-yellow-400 w-14 h-14 rounded-full flex items-center justify-center border-2 border-black mb-6">
                <Zap className="text-black w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Super Fast</h3>
              <p className="text-gray-700 text-lg">Order before 2 PM and we ship it today. Cravings don't like to wait.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bg-pink-50 rounded-3xl p-10 border-2 border-black shadow-[8px_8px_0px_0px_#000]"
            >
              <div className="bg-pink-500 w-14 h-14 rounded-full flex items-center justify-center border-2 border-black mb-6">
                <Star className="text-white w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Premium Quality</h3>
              <p className="text-gray-700 text-lg">No stale candy here. Everything is freshness guaranteed.</p>
            </motion.div>

            {/* Feature 4 - Large */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 bg-purple-50 rounded-3xl p-10 border-2 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-1">
                <div className="bg-purple-500 w-14 h-14 rounded-full flex items-center justify-center border-2 border-black mb-6">
                  <Gift className="text-white w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Gift Wrapping</h3>
                <p className="text-gray-700 text-lg">Perfect for birthdays, holidays, or apologies. We wrap it with love and style.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-black -rotate-2">
                 <span className="text-4xl">🎁</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- BIG CTA SECTION --- */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            {/* Background noise texture effect could go here */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
                DON'T DENY <br />
                YOUR <span className="text-pink-500">CRAVINGS</span>
              </h2>
              <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
                Join thousands of happy customers. Life is short, eat the sweet stuff first.
              </p>
              
              <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/shop') : '/shop'}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-yellow-400 text-black text-xl font-black px-12 py-5 rounded-full border-4 border-white shadow-[0px_0px_20px_rgba(250,204,21,0.5)]"
                >
                  GRAB SOME TREATS
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white border-t-2 border-black py-12 text-center">
         <Link to="/" className="flex items-center gap-3 group">
  <motion.div
    whileHover={{ rotate: 180, scale: 1.1 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="bg-black text-white p-2 rounded-lg border-2 border-transparent group-hover:bg-pink-500 group-hover:border-black transition-colors"
  >
    <Candy className="w-6 h-6" />
  </motion.div>
  <img 
    src="/assets/gts.png" 
    alt="SugarRush" 
    className="h-8 w-auto"
  />
</Link>
        <p className="text-gray-500">
            Designed with high sugar content By{' '}
            <a 
              href="https://thegauravthakur.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 font-semibold underline decoration-2 underline-offset-2 transition-colors"
            >
              Gaurav Thakur
            </a>
            .
        </p>
      </footer>
    </div>
  );
};