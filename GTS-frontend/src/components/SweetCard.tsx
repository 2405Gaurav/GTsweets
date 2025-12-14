import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, Minus, Plus, AlertCircle } from 'lucide-react';
import type { Sweet } from '../types';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: (id: string, quantity: number) => void;
  onAddToCart?: (id: string, quantity: number) => void;
  isAdmin: boolean;
}

export const SweetCard = ({ sweet, onPurchase, onAddToCart, isAdmin }: SweetCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleIncrement = () => quantity < sweet.quantity && setQuantity(q => q + 1);
  const handleDecrement = () => quantity > 1 && setQuantity(q => q - 1);

  const handleAddToCart = async () => {
    if (onAddToCart && !isAdmin) {
      setIsAdding(true);
      await onAddToCart(sweet._id, quantity);
      setIsAdding(false);
      setQuantity(1);
    }
  };

  const handlePurchase = () => {
    onPurchase?.(sweet._id, quantity);
    setQuantity(1);
  };

  const isSoldOut = sweet.quantity === 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col group"
    >
      {/* Compact Image Section */}
      <div className="relative h-40 bg-gray-50 border-b-2 border-black flex items-center justify-center overflow-hidden">
        {sweet.imageUrl ? (
          <img src={sweet.imageUrl} alt={sweet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-5xl select-none">🍬</span>
        )}
        
        {/* Badges */}
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-white border border-black rounded-md text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          {sweet.category}
        </span>
        {sweet.quantity < 10 && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 border border-black rounded-md text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${isSoldOut ? 'bg-red-500 text-white' : 'bg-yellow-400'}`}>
            {isSoldOut ? 'Sold Out' : `${sweet.quantity} left`}
          </span>
        )}
      </div>

      {/* Compact Content */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-lg font-black leading-tight line-clamp-1">{sweet.name}</h3>
          <span className="bg-pink-500 text-white px-1.5 py-0.5 rounded border border-black text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            ₹{sweet.price}
          </span>
        </div>

        <p className="text-xs text-gray-600 font-medium mb-3 line-clamp-2 h-8">
          {sweet.description}
        </p>

        {/* Compact Action Row */}
        <div className="mt-auto pt-3 border-t-2 border-dashed border-gray-200">
          {!isAdmin ? (
            <div className="flex items-stretch gap-2 h-9">
              {/* Mini Quantity Stepper */}
              {!isSoldOut && (
                <div className="flex items-center bg-gray-100 rounded-lg border-2 border-black px-1">
                  <button onClick={handleDecrement} disabled={quantity <= 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                  <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                  <button onClick={handleIncrement} disabled={quantity >= sweet.quantity} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><Plus className="w-3 h-3" /></button>
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut || isAdding}
                className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-400 border-2 border-black text-xs font-black uppercase rounded-lg hover:bg-yellow-500 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {isAdding ? '...' : 'Add'}
              </button>

              {onPurchase && (
                <button
                  onClick={handlePurchase}
                  disabled={isSoldOut}
                  className="px-3 bg-purple-500 text-white border-2 border-black rounded-lg hover:bg-purple-600 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                >
                  <Package className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-1.5 bg-gray-50 rounded border-2 border-gray-200 border-dashed">
              <AlertCircle className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-bold text-gray-400 uppercase">Admin View</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};