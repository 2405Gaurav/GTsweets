import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import type { Sweet, CreateSweetRequest } from '../types';

interface SweetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSweetRequest) => Promise<void>;
  sweet?: Sweet | null;
}

const categories = ['all', 'cake', 'candy', 'chocolate','cookie','Halwa','Milk based','Dry fruit Based','Syrup based'];

export const SweetFormModal = ({ isOpen, onClose, onSubmit, sweet }: SweetFormModalProps) => {
  const [formData, setFormData] = useState<CreateSweetRequest>({
    name: '',
    category: 'all',
    price: 0,
    quantity: 0,
    description: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        description: sweet.description,
        imageUrl: sweet.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'candy',
        price: 0,
        quantity: 0,
        description: '',
        imageUrl: '',
      });
    }
  }, [sweet, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border-2 border-black rounded-xl font-bold bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all placeholder:font-medium placeholder:text-gray-400";
  const labelClass = "block text-xs font-black uppercase text-gray-700 mb-1 tracking-wide";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-yellow-400 border-b-4 border-black p-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter">
                {sweet ? 'Edit Treat' : 'New Sweet'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 bg-white border-2 border-black rounded-lg hover:bg-red-500 hover:text-white transition-colors active:translate-y-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Sweet Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Super Sour Gummy"
                  />
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`${inputClass} capitalize cursor-pointer`}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stock</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe the flavor explosion..."
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Image URL</label>
                  <div className="flex gap-3 items-start">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className={inputClass}
                      placeholder="https://..."
                    />
                    {formData.imageUrl && (
                      <div className="w-20 h-14 shrink-0 rounded-lg border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-gray-100">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=x';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t-2 border-dashed border-gray-300">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white text-black border-2 border-black font-black uppercase rounded-xl hover:bg-gray-100 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pink-500 text-white border-2 border-black font-black uppercase rounded-xl hover:bg-pink-600 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {sweet ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};