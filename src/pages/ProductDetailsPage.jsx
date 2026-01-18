import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react'; 
import { useShop } from '../context/MyShopContext';
import { fetchProductDetailsAPI } from '../services/fetch'; 
// Optional: Import Skeleton if you have it, but I used standard divs below to ensure it works instantly without errors.

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useShop();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['product', id], 
    queryFn: () => fetchProductDetailsAPI(id),
    staleTime: 1000 * 60 * 5, 
  });

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // --- 1. NEW SKELETON LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        {/* Skeleton Container */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center animate-pulse">
          
          {/* Left: Image Skeleton */}
          <div className="bg-[#1a1a1a] h-[400px] md:h-[500px] w-full rounded-2xl" />

          {/* Right: Text Details Skeleton */}
          <div className="space-y-6 w-full">
            {/* Title Bar */}
            <div className="h-10 w-3/4 bg-[#1a1a1a] rounded-lg" />
            {/* Price Bar */}
            <div className="h-8 w-1/4 bg-[#1a1a1a] rounded-lg" />
            
            {/* Description Lines */}
            <div className="space-y-3 pt-2">
              <div className="h-4 w-full bg-[#1a1a1a] rounded" />
              <div className="h-4 w-full bg-[#1a1a1a] rounded" />
              <div className="h-4 w-2/3 bg-[#1a1a1a] rounded" />
            </div>

            {/* Size Buttons Skeleton */}
            <div className="pt-4">
              <div className="h-4 w-20 bg-[#1a1a1a] mb-3 rounded" />
              <div className="flex gap-3">
                <div className="h-10 w-12 bg-[#1a1a1a] rounded-lg" />
                <div className="h-10 w-12 bg-[#1a1a1a] rounded-lg" />
                <div className="h-10 w-12 bg-[#1a1a1a] rounded-lg" />
              </div>
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className="pt-4">
              <div className="h-14 w-full md:w-1/2 bg-[#1a1a1a] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. ERROR STATE ---
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

  // --- 3. SUCCESS STATE ---
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

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      setErrorMessage("Please select a size to continue.");
      return;
    }
    setErrorMessage(""); 
    addToCart(product, selectedSize || 'One Size');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative">
      
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

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* LEFT: Image */}
          <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] w-full">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://via.placeholder.com/500?text=No+Image"; }}
            />
          </div>

          {/* RIGHT: Details */}
          <div className="space-y-6"> 
            <div>
              <h1 className="text-3xl font-extrabold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-yellow-400 font-bold">₵{product.price}</span>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            {/* SIZES */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 transition-colors ${errorMessage ? "text-red-500" : "text-gray-500"}`}>
                  Select Size {errorMessage && "*"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setErrorMessage("");
                      }}
                      className={`min-w-[45px] h-10 px-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : errorMessage 
                            ? 'border-red-500 text-red-500 bg-red-900/20' 
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-9 px-4 rounded-full border text-sm capitalize transition-all ${
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
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.status !== 'available'}
                className="w-full md:w-auto px-8 py-3 bg-yellow-400 text-black font-bold rounded-full flex items-center justify-center gap-3 hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default ProductDetailsPage;