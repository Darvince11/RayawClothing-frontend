import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Home, Menu, X, LogOut, User as UserIcon, ChevronDown, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useShop } from '../context/ShopContext'; 
import EditProfileModal from './EditProfileModal'; 

export default function Navbar() {
  const { getCartCount, user, logout } = useShop();
  const count = getCartCount();
  const navigate = useNavigate();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  
  const dropdownRef = useRef(null);
  
  // Close desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileOpen(false);
    navigate('/login');
  };

  const getDisplayName = () => {
    if (!user) return "Guest";
    return user.first_name || "Customer";
  };
  
  const displayName = getDisplayName();
  const userAvatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#1E1E1E]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between py-4 px-6 max-w-7xl mx-auto w-full">
          
          {/* Logo */}
          <Link to="/" className="z-50">
            <img src={logo} alt="Rayaw Logo" className="h-10 md:h-14 w-auto object-contain" />
          </Link>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition hover:bg-white/5 px-3 py-2 rounded-lg">
              <Home size={18} /> <span>Home</span>
            </Link>

            <div className="h-4 w-px bg-gray-700"></div>

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 focus:outline-none group"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden group-hover:border-primary transition">
                     <img src={userAvatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="hidden lg:block text-left">
                      <p className="text-sm font-bold text-white group-hover:text-primary transition leading-tight capitalize">
                          {displayName}
                      </p>
                      <p className="text-[10px] text-gray-400">Valued Customer</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Desktop Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#252525] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden z-[100]">
                    <div className="px-4 py-4 border-b border-white/5 flex items-center gap-3">
                      <img src={userAvatar} className="w-10 h-10 rounded-full object-cover" />
                      <div className="overflow-hidden">
                        <p className="text-white font-bold truncate capitalize">{displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                          setIsEditModalOpen(true);
                          setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition"
                    >
                      <Settings size={16} /> Edit Profile
                    </button>

                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 flex items-center gap-2 transition">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-300 hover:text-white transition">Login</Link>
                <Link to="/signup" className="text-sm px-5 py-2.5 bg-primary text-black font-bold rounded-lg hover:bg-yellow-400 transition shadow-lg shadow-primary/20">
                  Sign up
                </Link>
              </>
            )}
            
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition">
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#1E1E1E]">
                  {count}
                </span>
              )}
            </Link>
          </div>

          {/* --- MOBILE TOGGLE BUTTON --- */}
          <div className="flex items-center gap-4 md:hidden z-40">
            <Link to="/cart" className="relative text-gray-300">
              <ShoppingBag size={24} />
              {count > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#1E1E1E]">{count}</span>}
            </Link>
            <button onClick={() => setIsMobileOpen(true)} className="text-white p-1">
               <Menu size={30} />
            </button>
          </div>

          {/* --- CENTERED MOBILE MENU --- */}
          {isMobileOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 min-h-screen">
              
              <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setIsMobileOpen(false)}
              ></div>

              <div className="relative bg-[#1E1E1E] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                
                <button 
                  onClick={() => setIsMobileOpen(false)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
                >
                  <X size={24} />
                </button>

                <div className="flex flex-col items-center p-8 text-center">
                   
                   {user ? (
                     <>
                       <div className="w-24 h-24 rounded-full border-4 border-primary/20 p-1 mb-4 shadow-xl">
                          <img src={userAvatar} className="w-full h-full object-cover rounded-full" />
                       </div>
                       <h2 className="text-2xl font-bold text-white capitalize mb-1">{displayName}</h2>
                       <p className="text-sm text-gray-400 mb-8">{user.email}</p>

                       <div className="w-full space-y-3">
                          <Link 
                            to="/" 
                            onClick={() => setIsMobileOpen(false)}
                            className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition"
                          >
                             <Home size={20} /> Home Page
                          </Link>

                          <button 
                             onClick={() => {
                                 setIsEditModalOpen(true);
                                 setIsMobileOpen(false);
                             }}
                             className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition"
                          >
                             <Settings size={20} /> Edit Profile
                          </button>

                          <button 
                            onClick={handleLogout} 
                            className="flex items-center justify-center gap-3 w-full py-4 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition"
                          >
                             <LogOut size={20} /> Logout
                          </button>
                       </div>
                     </>
                   ) : (
                     <>
                       <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500">
                          <UserIcon size={40} />
                       </div>
                       <h2 className="text-xl font-bold text-white mb-8">Welcome to Rayaw</h2>
                       
                       <div className="w-full space-y-3">
                          <Link 
                            to="/login" 
                            onClick={() => setIsMobileOpen(false)}
                            className="block w-full py-4 text-center font-bold text-white bg-white/5 hover:bg-white/10 rounded-xl transition"
                          >
                            Login
                          </Link>
                          <Link 
                            to="/signup" 
                            onClick={() => setIsMobileOpen(false)}
                            className="block w-full py-4 text-center font-bold text-black bg-primary hover:bg-yellow-400 rounded-xl shadow-lg transition"
                          >
                            Sign Up
                          </Link>
                       </div>
                     </>
                   )}

                </div>
              </div>
            </div>
          )}

        </div>
      </nav>
      
      {/* CRITICAL FIX: MOVED OUTSIDE THE NAV
        This allows the modal to cover the full screen without being trapped
        by the navbar's backdrop-filter or sticky positioning.
      */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  );
}