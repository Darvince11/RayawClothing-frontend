import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { useShop } from '../context/shopcontext'; 

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { products, addToCart } = useShop(); 
  const [selectedSize, setSelectedSize] = useState(null);
  const [product, setProduct] = useState(null);

  // --- NEW: Notification State ---
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Find Product Logic
  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
    }
  }, [id, products]);

  // --- NEW: Helper to show notification ---
  const showMessage = (msg, type) => {
    setNotification({ show: true, message: msg, type: type });
    // Hide after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAddToCart = () => {
    // 1. Error Condition: No size selected
    if (!selectedSize) {
      showMessage("Please select a size before adding to cart!", "error");
      return;
    }
    
    // 2. Success Condition
    addToCart(product, selectedSize);
    showMessage(`Added ${product.name} (Size: ${selectedSize}) to cart!`, "success");
  };

  // Loading State
  if (!product) {
    return (
      <div className="text-center py-20 text-white">
        <p className="text-xl mb-4">Product not found.</p>
        <Link to="/" className="text-primary hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative">
      
      {/* --- NEW: Notification Banner (Top Center) --- */}
      {notification.show && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-300 animate-bounce-in
          ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span className="font-bold">{notification.message}</span>
        </div>
      )}
      {/* --------------------------------------------- */}

      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
        <ArrowLeft size={20} /> Back to Collection
      </Link>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-gray-100 rounded-2xl overflow-hidden aspect-[4/5] relative group">
           <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-full object-cover mix-blend-multiply"
           />
           <button className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg text-gray-600 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
             <Heart size={24} />
           </button>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div>
            <h5 className="text-primary tracking-widest text-sm font-bold mb-2 uppercase">Rayaw Essentials</h5>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{product.name}</h1>
            <p className="text-2xl font-mono text-primary mb-6">
              {product.currency} {product.price.toFixed(2)}
            </p>
            <p className="text-gray-300 leading-relaxed mb-8">
              {product.description || "No description available for this product."}
            </p>
          </div>

          {/* Size Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-bold mb-3 text-gray-200">Select Size <span className="text-red-500">*</span></h3>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition 
                  ${selectedSize === size 
                    ? 'border-primary text-primary bg-primary/10' 
                    : 'border-[#333] text-gray-400 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-4 mt-auto">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}