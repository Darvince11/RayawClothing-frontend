import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react'; 
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton'; 
import { useShop } from '../context/MyShopContext'; 

export default function HomePage() {
  const { 
    products, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useShop(); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // --- SAFE FILTERING ---
  const filteredProducts = products.filter(product => {
    if (!product || !product.name) return false;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || (product.category === activeCategory) || (!product.category && activeCategory === "All");
    return matchesSearch && matchesCategory;
  });

  // --- INFINITE SCROLL LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (isBottom && hasNextPage && !isFetchingNextPage) {
        console.log("Loading more products...");
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="pb-20">
      <Hero />

      <main className="max-w-7xl mx-auto px-6">
        
        {/* Search & Filter Section */}
        <div className="flex flex-col md:flex-row gap-3 mb-8 items-center">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#2C2C2C] text-sm text-white pl-10 pr-4 py-2.5 rounded-lg border border-transparent focus:border-gray-600 outline-none w-64 md:w-80"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 bg-[#2C2C2C] text-white text-sm px-4 py-2.5 rounded-lg hover:bg-[#333] border border-transparent focus:border-gray-600 transition group"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6667 3.33334H3.33334L8.00001 9.55584C8.21638 9.84434 8.33334 10.1952 8.33334 10.5558V16.6667L11.6667 15V10.5558C11.6667 10.1952 11.7836 9.84434 12 9.55584L16.6667 3.33334Z" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
              </svg>
              <span className="capitalize font-medium">{activeCategory}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="absolute left-0 top-full mt-2 bg-[#2C2C2C] border border-[#444] rounded-xl p-2 w-48 shadow-xl z-50 flex flex-col gap-1">
                {["All", "Sweaters", "Hoodies", "T-Shirts", "Accessories"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setShowFilters(false); }}
                    className={`text-left text-sm py-2 px-3 rounded-lg transition ${activeCategory === cat ? 'bg-white text-black font-bold' : 'text-gray-300 hover:bg-[#3E3E3E]'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {/* FIX APPLIED HERE: */}
        {/* justify-items-center (Centers on Mobile) */}
        {/* md:justify-items-start (Aligns Left on Desktop to match Search Bar) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center md:justify-items-start">
          
          {/* A: LOADING STATE */}
          {isLoading ? (
             Array.from({ length: 6 }).map((_, index) => (
               <ProductSkeleton key={`skeleton-${index}`} />
             ))
          ) : filteredProducts.length > 0 ? (
             // B: REAL DATA
             filteredProducts.map((product) => (
               <ProductCard key={product.id} product={product} />
             ))
          ) : (
             // C: NO RESULTS
             <div className="col-span-full w-full text-center text-gray-500 py-20">
               No products found matching {searchTerm}
             </div>
          )}

          {/* D: INFINITE SCROLL LOADING */}
          {isFetchingNextPage && (
            Array.from({ length: 3 }).map((_, index) => (
              <ProductSkeleton key={`loading-more-${index}`} />
            ))
          )}

        </div>

        {/* End of List Message */}
        {!hasNextPage && !isLoading && filteredProducts.length > 0 && (
          <p className="text-center text-gray-500 mt-12 text-sm opacity-50">
            You've reached the end
          </p>
        )}

      </main>
    </div>
  );
}