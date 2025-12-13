import { motion } from 'framer-motion';
import { Candy } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Candy className="w-8 h-8 text-pink-500" />
      </motion.div>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="text-center space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 font-medium">Loading sweet treats...</p>
      </div>
    </div>
  );
};
