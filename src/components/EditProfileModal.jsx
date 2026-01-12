import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useShop();
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData); 
    onClose(); 
  };

  return (
    // FIX: z-[9999] ensures it is the highest thing on the entire website
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center backdrop-blur-sm p-4">
      
      {/* Modal Box */}
      <div className="bg-[#1a1a1a] p-6 md:p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">First Name</label>
            <input 
              type="text" 
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Last Name</label>
            <input 
              type="text" 
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition"
              placeholder="+233..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Email (Cannot be changed)</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled 
              className="w-full bg-[#222] border border-transparent rounded-lg p-3 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition shadow-lg shadow-yellow-400/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;