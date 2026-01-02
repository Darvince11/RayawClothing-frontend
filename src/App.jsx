import { Routes, Route } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useShop } from './context/ShopContext'; 

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// --- The Global Notification Component ---
const GlobalNotification = () => {
  const { notification } = useShop();

  // If no message, show nothing
  if (!notification) return null;

  return (
    <div className={`fixed top-10 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-5 z-[100] border border-white/10
      ${notification.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}
    `}>
       {notification.type === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
       <span className="font-bold text-sm md:text-base">{notification.message}</span>
    </div>
  );
};

function App() {
  return (
    <>
      {/* This Popup will now float above EVERY page */}
      <GlobalNotification />
      
      <Routes>
        {/* Main Layout (Navbar + Content) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>

        {/* Auth Pages (No Navbar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default App;