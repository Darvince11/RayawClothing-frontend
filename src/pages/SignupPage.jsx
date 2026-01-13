import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { useShop } from '../context/MyShopContext';

export default function SignupPage() {
  const { register } = useShop(); 
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // FIXED: Using the exact keys from the Go Backend Model
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    user_password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // This now sends the data exactly how the backend wants it
    const success = await register(formData);
    
    setIsLoading(false);
    if (success) {
      navigate('/'); 
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-[#1E1E1E] p-8 md:p-10 rounded-3xl w-full max-w-md border border-white/5 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join Rayaw for exclusive access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row for First & Last Name */}
          <div className="flex gap-4">
            {/* First Name */}
            <div className="relative group flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
              <input 
                required
                type="text" 
                placeholder="First Name"
                className="w-full bg-[#2C2C2C] text-white pl-12 pr-4 py-4 rounded-xl border border-transparent focus:border-primary/50 focus:bg-[#333] outline-none transition-all placeholder:text-gray-500"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
            </div>

            {/* Last Name */}
            <div className="relative group flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
              <input 
                required
                type="text" 
                placeholder="Last Name"
                className="w-full bg-[#2C2C2C] text-white pl-12 pr-4 py-4 rounded-xl border border-transparent focus:border-primary/50 focus:bg-[#333] outline-none transition-all placeholder:text-gray-500"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
            <input 
              required
              type="email" 
              placeholder="Email Address"
              className="w-full bg-[#2C2C2C] text-white pl-12 pr-4 py-4 rounded-xl border border-transparent focus:border-primary/50 focus:bg-[#333] outline-none transition-all placeholder:text-gray-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Phone (Changed to phone_number) */}
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
            <input 
              required
              type="tel" 
              placeholder="Phone Number"
              className="w-full bg-[#2C2C2C] text-white pl-12 pr-4 py-4 rounded-xl border border-transparent focus:border-primary/50 focus:bg-[#333] outline-none transition-all placeholder:text-gray-500"
              value={formData.phone_number}
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
            />
          </div>

          {/* Password (Changed to user_password) */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
            <input 
              required
              type="password" 
              placeholder="Password"
              className="w-full bg-[#2C2C2C] text-white pl-12 pr-4 py-4 rounded-xl border border-transparent focus:border-primary/50 focus:bg-[#333] outline-none transition-all placeholder:text-gray-500"
              value={formData.user_password}
              onChange={(e) => setFormData({...formData, user_password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2 mt-6 shadow-lg shadow-primary/20"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Sign Up <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}