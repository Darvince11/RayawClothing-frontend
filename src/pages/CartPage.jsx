// src/pages/CartPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <--- Added useNavigate
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Smartphone, CheckCircle, Printer, ArrowLeft } from 'lucide-react'; // <--- Added ArrowLeft
import { useShop } from '../context/MyShopContext';
import logo from '../assets/logo.png';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useShop();
  const navigate = useNavigate(); // <--- Initialize Hook
  
  // States
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'receipt'
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'momo'
  });

  const total = getTotalPrice();

  // Handle Payment Simulation
  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      setOrderDetails({
        id: `ORD-${Math.floor(Math.random() * 100000)}`,
        date: new Date().toLocaleDateString()
      });
      
      setLoading(false);
      setStep('receipt');
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
    clearCart();
  };

  // --- RENDER: EMPTY CART ---
  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Optional Back Button for Empty State */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Go Back
        </button>

        <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="bg-primary text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  // --- RENDER: RECEIPT VIEW ---
  if (step === 'receipt' && orderDetails) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white text-black p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Watermark Logo */}
          <img src={logo} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 opacity-5 pointer-events-none" />

          {/* Header */}
          <div className="flex justify-between items-start mb-8 border-b pb-8">
            <img src={logo} alt="Rayaw" className="h-16 object-contain" />
            <div className="text-right">
              <h1 className="text-2xl font-bold text-green-600 flex items-center justify-end gap-2">
                <CheckCircle size={24} /> PAID
              </h1>
              <p className="text-gray-500 text-sm mt-1">Order #{orderDetails.id}</p>
              <p className="text-gray-500 text-sm">{orderDetails.date}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Billed To</p>
              <p className="font-bold text-lg">{formData.name}</p>
              <p className="text-sm text-gray-600">{formData.email}</p>
              <p className="text-sm text-gray-600">{formData.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-500 uppercase">Payment Method</p>
              <p className="font-bold text-lg capitalize">{formData.paymentMethod === 'momo' ? 'Mobile Money' : 'Credit Card'}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Size</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 text-sm">{item.name}</td>
                  <td className="text-center py-3 text-sm">{item.size}</td>
                  <td className="text-center py-3 text-sm">{item.quantity}</td>
                  <td className="text-right py-3 text-sm font-mono">{item.currency} {(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end border-t pt-4">
            <div className="text-right">
              <p className="text-gray-500">Total Amount</p>
              <p className="text-3xl font-bold">{cart[0]?.currency || "GHS"} {total.toFixed(2)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex gap-4 print:hidden">
            <button onClick={handlePrint} className="flex-1 bg-black text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800">
              <Printer size={18} /> Print / Save PDF
            </button>
            <Link to="/" onClick={clearCart} className="flex-1 border-2 border-black text-black py-3 rounded-lg font-bold flex items-center justify-center hover:bg-gray-100">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: CART & CHECKOUT FORM ---
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* --- ADDED BACK BUTTON --- */}
      <button 
        onClick={() => step === 'checkout' ? setStep('cart') : navigate(-1)} 
        className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" /> 
        {step === 'checkout' ? 'Back to Cart' : 'Go Back'}
      </button>
      {/* ------------------------- */}

      <h1 className="text-3xl font-bold text-white mb-8">
        {step === 'cart' ? 'Shopping Cart' : 'Checkout Details'}
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* LEFT COLUMN */}
        <div className="flex-1">
          {step === 'cart' ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="bg-[#252525] p-4 rounded-xl flex items-center gap-4">
                  <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-1">Size: {item.size}</p>
                    <p className="text-primary font-mono">{item.currency} {item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-[#1E1E1E] rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.size, -1)} className="text-gray-400 hover:text-white"><Minus size={14} /></button>
                    <span className="text-white text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, 1)} className="text-gray-400 hover:text-white"><Plus size={14} /></button>
                  </div>

                  <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-500 hover:text-red-400 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handlePayment} className="bg-[#252525] p-6 rounded-xl space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                <input required type="text" className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                <input required type="email" className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" 
                   value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Phone Number (For Momo)</label>
                <input required type="tel" className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" 
                   value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <div className="pt-4">
                <label className="block text-gray-400 text-sm mb-3">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" 
                    onClick={() => setFormData({...formData, paymentMethod: 'momo'})}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${formData.paymentMethod === 'momo' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-700 text-gray-400'}`}>
                    <Smartphone size={24} />
                    <span className="font-bold text-sm">Mobile Money</span>
                  </button>
                  <button type="button" 
                    onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${formData.paymentMethod === 'card' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-700 text-gray-400'}`}>
                    <CreditCard size={24} />
                    <span className="font-bold text-sm">Card Payment</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-80 h-fit bg-[#252525] p-6 rounded-xl sticky top-24">
          <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
          <div className="space-y-3 mb-6 border-b border-gray-700 pb-6">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>GHS {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Delivery</span>
              <span>Free</span>
            </div>
          </div>
          <div className="flex justify-between text-white font-bold text-xl mb-8">
            <span>Total</span>
            <span className="text-primary">GHS {total.toFixed(2)}</span>
          </div>

          {step === 'cart' ? (
            <button onClick={() => setStep('checkout')} className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          ) : (
            <button form="checkout-form" disabled={loading} className="w-full bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400 transition flex items-center justify-center gap-2">
              {loading ? "Processing..." : `Pay GHS ${total.toFixed(2)}`}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}