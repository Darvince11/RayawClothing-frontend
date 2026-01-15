import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';
import { useShop } from '../context/MyShopContext';
import { fetchProductDetailsAPI } from '../services/fetch'; 

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useShop();

  // Local state for user selections
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  
  // NEW: State for the Error Notification
  const [errorMessage, setErrorMessage] = useState("");

  // --- 1. FETCH DATA ---
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['product', id], 
    queryFn: () => fetchProductDetailsAPI(id),
    staleTime: 1000 * 60 * 5, 
  });

  // Auto-clear error after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // --- 2. LOADING & ERROR STATES ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Loading product details...
      </div>
    );
  }

  if (isError || !response?.success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-xl text-red-500">Product not found.</p>
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white underline">
          Go Back Home
        </button>
      </div>
    );
  }

  // --- 3. DATA MAPPING ---
  const backendProduct = response.data;
  const product = {
    id: backendProduct.id,
    name: backendProduct.product_name,        
    price: backendProduct.price,
    description: backendProduct.product_description,
    image: backendProduct.image_url,          
    sizes: backendProduct.product_size || [], 
    colors: backendProduct.color || [],       
    status: backendProduct.product_status
  };

  // --- MODERN VALIDATION LOGIC ---
  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      // Show the modern red error instead of alert()
      setErrorMessage("Please select a size to continue.");
      return;
    }
    
    // Clear error if successful
    setErrorMessage(""); 
    addToCart(product, selectedSize || 'One Size');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 relative">
      
      {/* --- NEW: MODERN ERROR POPUP --- */}
      {errorMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-red-400">
            <AlertCircle size={24} className="text-white" />
            <span className="font-bold tracking-wide">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Navbar Placeholder / Back Button */}
      <div className="p-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* LEFT: Image */}
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT: Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl text-yellow-400 font-bold">₵{product.price}</span>
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed">
            {product.description}
          </p>

          {/* SIZES */}
          {product.sizes.length > 0 && (
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 transition-colors ${errorMessage ? "text-red-500" : "text-gray-500"}`}>
                Select Size {errorMessage && "*"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setErrorMessage(""); // Clear error when they select one
                    }}
                    className={`min-w-[50px] h-12 px-4 rounded-lg border font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-white text-black border-white'
                        : errorMessage 
                          ? 'border-red-500 text-red-500 bg-red-900/20' // Highlight options in red on error
                          : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* COLORS */}
          {product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Select Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 px-4 rounded-full border text-sm capitalize transition-all ${
                      selectedColor === color
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTION BUTTON */}
          <div className="pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.status !== 'available'}
              className="w-full md:w-auto px-8 py-4 bg-yellow-400 text-black font-bold rounded-full flex items-center justify-center gap-3 hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.status === 'available' ? (
                <>
                  <ShoppingBag size={20} /> Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;