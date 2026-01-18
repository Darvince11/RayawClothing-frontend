import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useShop } from '../context/MyShopContext';

export default function CartPage() {
  // 1. Destructure 'showNotification' so we can use it
  const { cart, removeFromCart, updateQuantity, getTotalPrice, user, showNotification } = useShop(); 
  const navigate = useNavigate();
  const total = getTotalPrice();

  // --- THE FIXED LOGIC ---
  const handleCheckout = () => {
    if (!user) {
      // 2. Use the custom notification instead of alert
      showNotification("Please login to complete your purchase", "error");
      
      // Redirect to login
      navigate('/login');
    } else {
      // Proceed to checkout (feature coming soon)
      showNotification("Proceeding to secure checkout...", "success");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-4">
        <div className="bg-[#1a1a1a] p-6 rounded-full mb-6 animate-pulse">
            <ShoppingBag size={48} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-10 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <ShoppingBag className="text-yellow-400" /> Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 bg-[#1a1a1a] p-4 rounded-xl items-center border border-[#333] hover:border-gray-600 transition">
                
                {/* Image */}
                <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-400">Size: <span className="text-white">{item.selectedSize}</span></p>
                  <p className="text-yellow-400 font-bold mt-1">₵{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-[#0a0a0a] px-3 py-1 rounded-lg border border-[#333]">
                  <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)} className="p-1 hover:text-yellow-400">
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="p-1 hover:text-yellow-400">
                    <Plus size={16} />
                  </button>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.id, item.selectedSize)}
                  className="p-2 text-gray-500 hover:text-red-500 transition ml-2"
                  title="Remove Item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl h-fit border border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₵{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-400">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4 mb-8 flex justify-between text-xl font-bold text-white">
              <span>Total</span>
              <span>₵{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20"
            >
              Checkout <ArrowRight size={20} />
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              Secure Checkout powered by Paystack
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}