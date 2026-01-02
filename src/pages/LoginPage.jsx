import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function LoginPage() {
  const { login } = useShop(); // Get login function
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Call backend via Context
    const success = await login(formData.email, formData.password);
    
    setIsLoading(false);
    if (success) {
      navigate('/'); // Redirect to Home
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-[#1E1E1E] p-8 md:p-10 rounded-3xl w-full max-w-md border border-white/5 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
            <input 
              required
              type="password" 
              placeholder="Password"
              className="w-full bg-[#2C2C2C] text-white pl-12 pr-4 py-4 rounded-xl border border-transparent focus:border-primary/50 focus:bg-[#333] outline-none transition-all placeholder:text-gray-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="text-right">
            <button type="button" className="text-xs text-gray-400 hover:text-white transition">Forgot Password?</button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline font-bold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}