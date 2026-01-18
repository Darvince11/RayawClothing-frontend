import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useShop } from '../context/MyShopContext';

export default function PaymentsPage() {
  const { user } = useShop();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const loadData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        setPayments([
          { id: "PAY-8839202", date: "Jan 15, 2026", amount: 330.50, method: "Mobile Money (MTN)", status: "Success" },
          { id: "PAY-1102933", date: "Nov 05, 2025", amount: 450.00, method: "Mobile Money (MTN)", status: "Failed" }
        ]);

      } catch (error) {
        console.error("Failed to load payments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user, navigate]);

  const getStatusBadge = (status) => {
    const isSuccess = status.toLowerCase() === 'success';
    return (
      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
        isSuccess ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'
      }`}>
        {isSuccess ? <CheckCircle size={14} /> : <XCircle size={14} />} {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-6 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <CreditCard className="text-green-400" /> Payment History
        </h1>
        <p className="text-gray-400 mb-8">View all your financial transactions.</p>

        <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
          
          {/* HEADER: Hidden on Mobile, Visible on Desktop */}
          <div className="hidden md:grid grid-cols-4 gap-4 p-4 bg-white/5 text-sm font-bold text-gray-300 border-b border-white/10">
            <div>Reference ID</div>
            <div>Date</div>
            <div>Method</div>
            <div className="text-right">Amount & Status</div>
          </div>

          <div className="divide-y divide-white/5">
            
            {/* SKELETON */}
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                 <div key={i} className="p-4 flex flex-col md:grid md:grid-cols-4 gap-4 items-start md:items-center animate-pulse">
                   <div className="w-full space-y-1">
                      <div className="h-3 w-16 bg-gray-800 rounded md:hidden"></div>
                      <div className="h-4 w-32 bg-gray-800 rounded"></div>
                   </div>
                   <div className="w-full space-y-1">
                      <div className="h-3 w-10 bg-gray-800 rounded md:hidden"></div>
                      <div className="h-4 w-24 bg-gray-800 rounded"></div>
                   </div>
                   <div className="w-full space-y-1">
                      <div className="h-3 w-16 bg-gray-800 rounded md:hidden"></div>
                      <div className="h-4 w-32 bg-gray-800 rounded"></div>
                   </div>
                   <div className="w-full flex flex-row md:flex-col justify-between md:items-end gap-2 mt-2 md:mt-0">
                      <div className="h-6 w-20 bg-gray-800 rounded"></div>
                      <div className="h-6 w-20 bg-gray-800 rounded-full"></div>
                   </div>
                 </div>
               ))
            ) : (
              // REAL DATA
              payments.map((payment) => (
                <div key={payment.id} className="p-4 flex flex-col md:grid md:grid-cols-4 gap-4 items-start md:items-center hover:bg-white/5 transition">
                  
                  {/* Column 1: Reference */}
                  <div className="w-full">
                    {/* LABEL VISIBLE ONLY ON MOBILE */}
                    <span className="md:hidden text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Reference ID</span>
                    <p className="font-mono text-sm text-gray-300">{payment.id}</p>
                  </div>

                  {/* Column 2: Date */}
                  <div className="w-full">
                    <span className="md:hidden text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Date</span>
                    <p className="text-sm text-gray-400">{payment.date}</p>
                  </div>

                  {/* Column 3: Method */}
                  <div className="w-full">
                    <span className="md:hidden text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Payment Method</span>
                    <p className="text-sm text-gray-300">{payment.method}</p>
                  </div>

                  {/* Column 4: Amount & Status */}
                  <div className="w-full flex flex-row md:flex-col justify-between md:items-end gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t border-white/5 md:border-none">
                    <div>
                        <span className="md:hidden text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Amount</span>
                        <p className="font-bold text-white text-lg md:text-base">₵{payment.amount.toFixed(2)}</p>
                    </div>
                    <div>{getStatusBadge(payment.status)}</div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {!isLoading && payments.length === 0 && (
          <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-white/5 mt-4">
             <CreditCard size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
             <p className="text-gray-500">No payment history found.</p>
          </div>
        )}

        {payments.length > 0 && (
          <div className="mt-8 flex items-start gap-3 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
            <AlertCircle className="text-blue-400 shrink-0" size={20} />
            <p className="text-sm text-blue-200">
              Transactions are secured. If you notice any discrepancies, contact support immediately.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}