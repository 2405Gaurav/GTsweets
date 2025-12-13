import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, AlertTriangle, Candy, LogOut, DollarSign, Archive, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sweetsApi } from '../services/api';
import { Sweet, CreateSweetRequest, UpdateSweetRequest } from '../types';
import { SweetCard } from '../components/SweetCard';
import { SweetFormModal } from '../components/SweetFormModal';
import { RestockModal } from '../components/RestockModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

export const AdminDashboard = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [restockSweet, setRestockSweet] = useState<Sweet | null>(null);
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      const data = await sweetsApi.getAll();
      setSweets(data);
    } catch (error) {
      showToast('Failed to load sweets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSweet = async (data: CreateSweetRequest) => {
    try {
      await sweetsApi.create(data);
      showToast('Sweet added successfully!', 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Failed to add sweet', 'error');
    }
  };

  const handleEditSweet = async (data: UpdateSweetRequest) => {
    if (!selectedSweet) return;

    try {
      await sweetsApi.update(selectedSweet._id, data);
      showToast('Sweet updated successfully!', 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Failed to update sweet', 'error');
    }
  };

  const handleDeleteSweet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await sweetsApi.delete(id);
      showToast('Sweet deleted successfully', 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Failed to delete sweet', 'error');
    }
  };

  const handleRestock = async (quantity: number) => {
    if (!restockSweet) return;

    try {
      await sweetsApi.restock(restockSweet._id, { quantity });
      showToast(`Restocked ${restockSweet.name} successfully!`, 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Failed to restock', 'error');
    }
  };

  const openAddModal = () => {
    setSelectedSweet(null);
    setIsModalOpen(true);
  };

  const openEditModal = (id: string) => {
    const sweet = sweets.find((s) => s._id === id);
    if (sweet) {
      setSelectedSweet(sweet);
      setIsModalOpen(true);
    }
  };

  const openRestockModal = (id: string) => {
    const sweet = sweets.find((s) => s._id === id);
    if (sweet) {
      setRestockSweet(sweet);
      setIsRestockModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const lowStockSweets = sweets.filter((s) => s.quantity < 10);
  const totalSweets = sweets.length;
  const totalValue = sweets.reduce((sum, s) => sum + s.price * s.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans text-gray-900 pb-20">
      
      {/* --- Admin Header --- */}
      <div className="bg-purple-100 border-b-4 border-black py-8 mb-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-black text-white p-2 rounded-lg rotate-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
                <Archive size={24} />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tight">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600 font-bold ml-1">Welcome back, Boss <span className="text-purple-600">{user?.name}</span></p>
          </div>
          
          <div className="flex gap-3">
             <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white font-black uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        
        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Sweets */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5"
          >
            <div className="bg-pink-100 p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Candy className="w-8 h-8 text-black" />
            </div>
            <div>
              <p className="text-gray-500 font-black uppercase text-xs tracking-wider">Total Sweets</p>
              <p className="text-4xl font-black">{totalSweets}</p>
            </div>
          </motion.div>

          {/* Inventory Value */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5"
          >
            <div className="bg-yellow-100 p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <DollarSign className="w-8 h-8 text-black" />
            </div>
            <div>
              <p className="text-gray-500 font-black uppercase text-xs tracking-wider">Inventory Value</p>
              <p className="text-4xl font-black">₹{totalValue.toFixed(2)}</p>
            </div>
          </motion.div>

          {/* Low Stock */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5"
          >
            <div className={`p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${lowStockSweets.length > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <AlertTriangle className={`w-8 h-8 text-black`} />
            </div>
            <div>
              <p className="text-gray-500 font-black uppercase text-xs tracking-wider">Low Stock Items</p>
              <p className={`text-4xl font-black ${lowStockSweets.length > 0 ? 'text-red-500' : 'text-black'}`}>{lowStockSweets.length}</p>
            </div>
          </motion.div>
        </div>

        {/* --- Action Bar --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
             <div className="w-3 h-8 bg-black"></div>
             <h2 className="text-3xl font-black uppercase tracking-tight">Manage Inventory</h2>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white font-black uppercase rounded-xl border-2 border-black shadow-[5px_5px_0px_0px_#A855F7] hover:shadow-[8px_8px_0px_0px_#A855F7] transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Sweet
          </motion.button>
        </div>

        {/* --- Low Stock Alert Section --- */}
        {lowStockSweets.length > 0 && (
          <div className="bg-red-50 border-4 border-red-500 border-dashed rounded-3xl p-6 mb-10">
            <h3 className="text-2xl font-black text-red-600 mb-4 flex items-center gap-3 uppercase">
              <AlertTriangle className="w-8 h-8" />
              Critical Low Stock Alert
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockSweets.map((sweet) => (
                <div
                  key={sweet._id}
                  className="flex items-center justify-between bg-white border-2 border-red-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex flex-col">
                     <span className="font-bold text-gray-900">{sweet.name}</span>
                     <span className="text-red-500 font-black text-xs uppercase">{sweet.quantity} Units Left</span>
                  </div>
                  
                  <button
                    onClick={() => openRestockModal(sweet._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg border-2 border-red-200 transition-colors"
                    title="Restock Now"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Inventory Grid --- */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sweets.map((sweet, index) => (
              <motion.div
                key={sweet._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col h-full"
              >
                {/* 
                  Passing special props to SweetCard if supported, or wrapping it.
                  Assuming SweetCard handles "isAdmin" logic internally to show edit/delete.
                */}
                <div className="flex-grow">
                   <SweetCard
                    sweet={sweet}
                    // Note: If your SweetCard accepts onEdit/onDelete specifically for Admin, pass them here.
                    // If your current SweetCard only accepts onPurchase/onAddToCart, you might need to
                    // update SweetCard to accept onEdit/onDelete or wrap it in a container that has overlay buttons.
                    // Based on previous context, SweetCard had an Admin View placeholder.
                    // We will inject the Admin Controls below the card instead for cleaner UI.
                    isAdmin={true} 
                  />
                </div>
                
                {/* Admin Controls Block (Attached to bottom of card) */}
                <div className="mt-[-20px] pt-8 px-4 pb-4 bg-gray-100 border-x-2 border-b-2 border-black rounded-b-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative z-0 flex flex-col gap-2">
                   <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openEditModal(sweet._id)}
                        className="px-3 py-2 bg-white border-2 border-black rounded-lg font-bold text-sm hover:bg-yellow-100 active:translate-y-1 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSweet(sweet._id)}
                        className="px-3 py-2 bg-white border-2 border-black rounded-lg font-bold text-sm text-red-600 hover:bg-red-50 active:translate-y-1 transition-all"
                      >
                        Delete
                      </button>
                   </div>
                   <button
                    onClick={() => openRestockModal(sweet._id)}
                    className="w-full px-4 py-2 bg-blue-500 text-white font-bold text-sm uppercase border-2 border-black rounded-lg hover:bg-blue-600 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Restock
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modals - (Assuming these components exist and handle their own styling or are standard modals) */}
        <SweetFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSweet(null);
          }}
          onSubmit={selectedSweet ? handleEditSweet : handleAddSweet}
          sweet={selectedSweet}
        />

        <RestockModal
          isOpen={isRestockModalOpen}
          onClose={() => {
            setIsRestockModalOpen(false);
            setRestockSweet(null);
          }}
          onSubmit={handleRestock}
          sweetName={restockSweet?.name || ''}
          currentStock={restockSweet?.quantity || 0}
        />
      </div>
    </div>
  );
};