import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/MyShopContext';

export default function OrdersPage() {
  const { user } = useShop();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const loadData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        setOrders([
          { id: "ORD-7782-TEST", date: "Jan 15, 2026", total: 330.50, items: ["Running Shoes", "Cotton T-Shirt"] }
        ]); 

      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-6 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Package className="text-blue-400" /> Order History
        </h1>
        <p className="text-gray-400 mb-8">Review your past purchases.</p>

        <div className="space-y-4">
          
          {/* SKELETON */}
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 animate-pulse">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                  <div className="space-y-2 w-full md:w-auto">
                    <div className="h-6 w-32 bg-gray-800 rounded"></div>
                    <div className="h-4 w-24 bg-gray-800 rounded"></div>
                  </div>
                  <div className="flex justify-between md:block w-full md:w-auto">
                     <div className="h-4 w-10 bg-gray-800 rounded md:hidden"></div>
                     <div className="h-8 w-20 bg-gray-800 rounded"></div>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <div className="h-4 w-3/4 bg-gray-800 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            // REAL DATA
            orders.map((order) => (
              <div key={order.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 hover:border-white/10 transition">
                {/* MOBILE VIEW: flex-col (Stacked)
                   DESKTOP VIEW: flex-row (Side by side)
                */}
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                  
                  {/* Left Side: ID & Date */}
                  <div>
                    <h3 className="font-bold text-lg text-white">{order.id}</h3>
                    <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                  </div>
                  
                  {/* Right Side: Price */}
                  {/* On Mobile: We use 'flex justify-between w-full' to show "Total" label on left and Price on right */}
                  <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto bg-[#white/5] md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none border border-white/5 md:border-none">
                    <p className="md:hidden text-sm text-gray-400 font-medium">Total Amount</p>
                    <div>
                        <p className="hidden md:block text-xs text-gray-400 uppercase tracking-wider text-right">Total</p>
                        <p className="text-xl font-bold text-yellow-400">₵{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/5 pt-4">
                  <div className="flex items-start gap-3 text-sm text-gray-400">
                    <ShoppingBag size={18} className="mt-0.5 shrink-0" />
                    <span className="leading-relaxed">
                      {Array.isArray(order.items) ? order.items.join(", ") : order.items}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {!isLoading && orders.length === 0 && (
            <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-white/5">
              <Package size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
              <p className="text-gray-500">You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}